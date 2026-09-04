import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "delhi";

  const staticGTFS = {
    agency: {
      name: "Delhi Metro Rail Corporation & DTC Transit Network",
      url: "http://www.delhimetrorail.com",
      timezone: "Asia/Kolkata",
      status: "STATIC_GTFS_LOADED"
    },
    realtime_support: {
      vehicle_positions: "UNAVAILABLE_FROM_SOURCE",
      trip_updates: "UNAVAILABLE_FROM_SOURCE",
      service_alerts: "ACTIVE"
    },
    routes: [
      { id: "YELLOW", name: "Yellow Line (Samaypur Badli - Millennium City Centre)", mode: "Subway", color: "#FACC15", stops_count: 37, headway_min: 3.5 },
      { id: "BLUE", name: "Blue Line (Dwarka Sec 21 - Noida Electronic City)", mode: "Subway", color: "#3B82F6", stops_count: 50, headway_min: 4.0 },
      { id: "MAGENTA", name: "Magenta Line (Janakpuri W - Botanical Garden)", mode: "Subway", color: "#EC4899", stops_count: 25, headway_min: 5.0 },
      { id: "BUS-522", name: "Route 522 (Inder Puri - Lado Sarai)", mode: "Bus", color: "#10B981", stops_count: 42, headway_min: 10.0 },
      { id: "BUS-419", name: "Route 419 (Old Delhi Railway Station - Ambedkar Nagar)", mode: "Bus", color: "#10B981", stops_count: 36, headway_min: 12.0 }
    ],
    alerts: [
      {
        id: "alert-dmrc-1",
        header: "Yellow Line Peak Hour Frequency Boost",
        description: "Additional 6-minute short-loop trains deployed between Vishwavidyalaya and Central Secretariat.",
        severity: "INFO",
        updated_at: new Date().toISOString()
      }
    ]
  };

  return NextResponse.json(staticGTFS);
}