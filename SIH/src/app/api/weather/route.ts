import { NextRequest, NextResponse } from "next/server";
import { fetchLiveWeather, fetchLiveAirQuality } from "@/lib/weather-client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "28.6139");
  const lng = parseFloat(searchParams.get("lng") || "77.2090");

  const [weather, airQuality] = await Promise.all([
    fetchLiveWeather(lat, lng),
    fetchLiveAirQuality(lat, lng)
  ]);

  return NextResponse.json({ weather, airQuality });
}