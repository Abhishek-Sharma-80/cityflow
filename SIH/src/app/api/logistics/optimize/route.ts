import { NextRequest, NextResponse } from "next/server";
import { optimizeVRP } from "@/lib/vrp-optimizer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { depot, stops, num_vehicles, vehicle_capacity } = body;
    const result = await optimizeVRP(depot, stops, num_vehicles || 2, vehicle_capacity || 80);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}