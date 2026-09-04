import { NextRequest, NextResponse } from "next/server";
import { calculateMultiModalRoutes } from "@/lib/routing-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.origin || !body.destination) {
      return NextResponse.json(
        { error: "Invalid routing request: 'origin' and 'destination' coordinates are required." },
        { status: 400 }
      );
    }
    const routes = await calculateMultiModalRoutes(body);
    return NextResponse.json({ routes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to compute routes" }, { status: 400 });
  }
}