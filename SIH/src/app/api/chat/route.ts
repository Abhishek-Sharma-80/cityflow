import { NextRequest, NextResponse } from "next/server";
import { queryGroqChat, ChatMessage, GroundedCityTelemetry } from "@/lib/groq-client";
import { CITIES, DEFAULT_CITY_ID } from "@/config/cityConfig";
import { fetchLiveWeather, fetchLiveAirQuality } from "@/lib/weather-client";
import { calculateLogisticsPressureIndex } from "@/lib/pressure-calculator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, cityId = DEFAULT_CITY_ID, liveTelemetry } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const city = CITIES[cityId] || CITIES[DEFAULT_CITY_ID];

    let telemetry: GroundedCityTelemetry;

    if (liveTelemetry && liveTelemetry.city) {
      telemetry = liveTelemetry;
    } else {
      // Ingest live real-time feeds on-the-fly
      const [weather, airQuality] = await Promise.all([
        fetchLiveWeather(city.center[0], city.center[1]),
        fetchLiveAirQuality(city.center[0], city.center[1])
      ]);

      const pressure = calculateLogisticsPressureIndex(48, 140, [], weather);

      telemetry = {
        city,
        weather,
        airQuality,
        pressure,
        incidents: [],
        fleetCount: 6,
        delayedVehicles: 1
      };
    }

    const result = await queryGroqChat(messages as ChatMessage[], telemetry);

    return NextResponse.json({
      response: result.message,
      model: result.model,
      grounded: result.grounded,
      city: city.name,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process chat query" },
      { status: 500 }
    );
  }
}
