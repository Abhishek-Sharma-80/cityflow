import { NextRequest, NextResponse } from "next/server";
import { fetchOsmInfrastructure } from "@/lib/osm-client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const minLat = parseFloat(searchParams.get("minLat") || "28.40");
  const minLng = parseFloat(searchParams.get("minLng") || "76.84");
  const maxLat = parseFloat(searchParams.get("maxLat") || "28.88");
  const maxLng = parseFloat(searchParams.get("maxLng") || "77.34");

  const points = await fetchOsmInfrastructure([minLat, minLng, maxLat, maxLng]);
  return NextResponse.json({ points });
}