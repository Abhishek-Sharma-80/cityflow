import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/osm-client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  if (!query) return NextResponse.json([]);

  const results = await geocodeAddress(query);
  return NextResponse.json(results);
}