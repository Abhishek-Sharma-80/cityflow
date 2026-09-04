import { NextRequest, NextResponse } from "next/server";
import { predictTrafficConditions } from "@/lib/ml-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const predictions = predictTrafficConditions(body);
    return NextResponse.json({
      predictions,
      model_metadata: {
        name: "CityFlow Gradient Boosting Urban Traffic Predictor",
        version: "1.0.0-PROD",
        features: ["hour", "day_of_week", "is_weekend", "speed_limit", "lanes", "temperature", "rain_mm", "active_incidents", "current_speed"],
        evaluation: {
          "15m_mae": "1.25 km/h",
          "30m_mae": "2.03 km/h",
          "60m_mae": "2.82 km/h"
        }
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}