import { NextRequest, NextResponse } from "next/server";
import { predictLogisticsDemand } from "@/lib/ml-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hour, day_of_week, is_weekend, zone_type, rain_mm } = body;
    const prediction = predictLogisticsDemand(hour, day_of_week, is_weekend, zone_type, rain_mm);
    return NextResponse.json({ prediction });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}