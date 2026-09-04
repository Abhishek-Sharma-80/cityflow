import { CityGeography } from "@/config/cityConfig";
import { WeatherData, AirQualityData, LogisticsPressureBreakdown, IncidentReport } from "@/types";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroundedCityTelemetry {
  city: CityGeography;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  pressure: LogisticsPressureBreakdown | null;
  incidents: IncidentReport[];
  fleetCount?: number;
  activeVehicles?: number;
  delayedVehicles?: number;
  helplines?: Array<{ name: string; phone: string; category: string; purpose: string }>;
}

export interface GroqChatResult {
  message: string;
  model: string;
  grounded: boolean;
  tokens_used?: number;
}

/**
 * Builds the system prompt that grounds the LLM with live city telemetry
 * and defines its persona, domain scope, and behavioral rules.
 */
export function buildDynamicSystemPrompt(telemetry: GroundedCityTelemetry): string {
  const { city, weather, airQuality, pressure, incidents, helplines, fleetCount = 6, delayedVehicles = 1 } = telemetry;

  const weatherStr = weather
    ? `Temperature: ${weather.temperature_c}°C, Precipitation: ${weather.precipitation_mm}mm, Wind: ${weather.wind_speed_kmh}km/h, Humidity: ${weather.relative_humidity_pct}%, Condition: ${weather.weather_description}`
    : "Weather data is being fetched from Open-Meteo API";

  const aqiStr = airQuality
    ? `PM2.5: ${airQuality.aqi_pm2_5} µg/m³, Category: ${airQuality.category}`
    : "AQI data is being fetched from Copernicus API";

  const pressureStr = pressure
    ? `Overall Score: ${pressure.overall_score}/100 (Level: ${pressure.level}). Factors: ${pressure.factors?.map((f) => `${f.name}=${f.value}`).join(", ") || "Traffic, Weather, Hazards, Infrastructure"}`
    : "Logistics Pressure Index is being evaluated";

  const incidentsStr = incidents && incidents.length > 0
    ? incidents.map((inc) => `- [${inc.id}] ${inc.title} at ${inc.location_name} (Severity: ${inc.severity.toUpperCase()}, Status: ${inc.status})`).join("\n")
    : "No critical road incidents currently active.";

  const helplinesStr = helplines && helplines.length > 0
    ? helplines.map((h) => `- ${h.name}: ${h.phone} (${h.category} — ${h.purpose})`).join("\n")
    : `- Delhi Traffic Police Control Room: 1095 (Traffic — Jams, accident clearance, towing)
- National Emergency Response (ERSS): 112 (Emergency — Unified Police, Ambulance, Fire)
- NHAI Highway Breakdown SOS: 1033 (Highway — Expressway breakdown, crane recovery)
- Delhi Disaster Management (DDMA): 1077 (Disaster — Waterlogging, fallen trees)
- DMRC Metro Control: 155370 (Metro — Disruptions, feeder transit)
- DTC Public Bus Transit: 1800-11-8181 (Bus — Schedule enquiry, breakdowns)
- EV Charging Grid Support: 1800-209-5161 (EV — Charging bay faults)`;

  return `You are Jim, an intelligent AI assistant for CITYFLOW — an Urban Mobility & Smart City Logistics platform.

=== YOUR PERSONALITY ===
- You are friendly, helpful, professional, and concise.
- You speak naturally like a real assistant — not robotic.
- You can have brief casual greetings but always try to be helpful.

=== YOUR DOMAIN (WHAT YOU CAN HELP WITH) ===
You are an expert on everything related to this platform and urban mobility:
- Traffic conditions, congestion, road status, and route planning
- Urban freight logistics, order/package tracking, fleet dispatch, delivery corridors
- Public transit: Metro (DMRC), Buses (DTC), schedules, disruptions
- Weather impact on city operations and logistics
- Air quality, pollution levels, and their effect on transport
- Road hazards, waterlogging, accidents, and incident reports
- Emergency helplines and contact numbers for city services
- EV charging infrastructure, smart parking, green corridors
- The CITYFLOW platform itself: its features, modules, dashboard, maps, analytics
- Smart city operations, logistics pressure index, demand forecasting

When users ask about these topics, provide thorough, helpful, and accurate answers using the live city data provided below.

=== OFF-TOPIC QUESTIONS ===
If a user asks something clearly unrelated to urban mobility, city logistics, or this platform (e.g., cooking recipes, movie recommendations, personal relationship advice, general coding help, politics, sports scores, etc.):
- Politely let them know that you're Jim, the CITYFLOW AI assistant, and you're specialized in urban mobility and city logistics.
- Suggest what you CAN help with instead.
- Be warm and not dismissive — something like: "I appreciate your curiosity! However, I'm Jim — CITYFLOW's urban mobility assistant. I'm best at helping with traffic updates, order tracking, route planning, emergency helplines, and city logistics. How can I help you with those?"
- Do NOT answer the off-topic question itself.

=== LIVE CITY DATA (REAL-TIME) ===
City: ${city.name}, ${city.country}
Coordinates: ${city.center[0]}, ${city.center[1]}
Timezone: ${city.timezone}
Transit Authority: ${city.transitAgency}

Current Weather: ${weatherStr}

Air Quality: ${aqiStr}

Logistics Pressure Index: ${pressureStr}

Active Fleet: ${fleetCount} vehicles deployed (${fleetCount - delayedVehicles} on-time, ${delayedVehicles} delayed)

Active Incidents:
${incidentsStr}

Emergency & Transit Helplines:
${helplinesStr}

Logistics Hubs: ${city.logisticsHubs?.map(h => h.name).join(", ") || "N/A"}
Key Delivery Zones: ${city.sampleDeliveryStops?.map(s => s.name).join(", ") || "N/A"}

=== RESPONSE GUIDELINES ===
- Use the live data above to give grounded, accurate answers.
- Format responses cleanly with markdown when helpful (bold, bullet points, headers).
- Keep responses concise but complete — don't ramble.
- If a user asks to track an order or consignment, use the fleet/logistics data to provide a realistic status update.
- If a user asks about emergencies, provide the relevant helpline numbers from the data above.
- Always be ready to help the user navigate the CITYFLOW platform.`;
}

/**
 * Calls the Groq API to get a real LLM response.
 * No hardcoded fallbacks — every query goes through the actual LLM.
 */
export async function queryGroqChat(
  messages: ChatMessage[],
  telemetry: GroundedCityTelemetry
): Promise<GroqChatResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      message: "⚠️ Groq API key is not configured. Please add your GROQ_API_KEY to the .env.local file to enable AI responses. You can get a free key at console.groq.com",
      model: "none",
      grounded: false
    };
  }

  const systemPrompt = buildDynamicSystemPrompt(telemetry);
  const fullMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages.filter(m => m.role !== "system").slice(-10) // Last 10 turns for context
  ];

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: fullMessages,
        temperature: 0.4,
        max_tokens: 1024,
        top_p: 0.9
      }),
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Groq API error:", res.status, errBody);

      // Provide a clear error message instead of fake hardcoded responses
      if (res.status === 401) {
        return {
          message: "⚠️ The Groq API key appears to be invalid. Please check your GROQ_API_KEY in .env.local",
          model: "error",
          grounded: false
        };
      }
      if (res.status === 429) {
        return {
          message: "I'm receiving too many requests right now. Please wait a moment and try again.",
          model: "rate-limited",
          grounded: false
        };
      }

      return {
        message: "I'm having trouble connecting to my AI service right now. Please try again in a moment.",
        model: "error",
        grounded: false
      };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        message: "I received an empty response. Could you please rephrase your question?",
        model: data.model || "llama-3.3-70b-versatile",
        grounded: false
      };
    }

    return {
      message: content,
      model: data.model || "llama-3.3-70b-versatile",
      grounded: true,
      tokens_used: data.usage?.total_tokens
    };
  } catch (err: any) {
    console.error("Groq API call failed:", err.message);

    if (err.name === "TimeoutError" || err.message?.includes("timeout")) {
      return {
        message: "The request timed out. Please try again — I'll respond faster this time!",
        model: "timeout",
        grounded: false
      };
    }

    return {
      message: "I'm having a connection issue right now. Please check your internet and try again.",
      model: "error",
      grounded: false
    };
  }
}
