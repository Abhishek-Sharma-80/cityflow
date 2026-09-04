import { NextRequest, NextResponse } from "next/server";
import { CITIES, DEFAULT_CITY_ID } from "@/config/cityConfig";
import { FleetVehicle } from "@/data/fleetData";

// In-memory state store for mutable fleet updates per session
const cityFleetStore: Record<string, FleetVehicle[]> = {};

function generateDynamicFleetForCity(cityId: string): FleetVehicle[] {
  const city = CITIES[cityId] || CITIES[DEFAULT_CITY_ID];
  const [centerLat, centerLng] = city.center;
  const hubs = city.logisticsHubs || [];
  const stops = city.sampleDeliveryStops || [];

  const vehicleTemplates = [
    {
      suffix: "EV-101",
      name: "Apex Electric Courier Van #1",
      type: "EV_VAN" as const,
      driver: "Rajesh Kumar",
      phoneExt: "Dispatch Ext: #101 (Central Control)",
      sosPhone: "1095",
      sosLabel: `${city.name} Traffic Police SOS: 1095`,
      dLat: 0.018,
      dLng: 0.012,
      speed: 38,
      battery: 76,
      packages: 34,
      capUtil: 68,
      temp: 4.2
    },
    {
      suffix: "HV-204",
      name: "Intercity Freightliner Heavy Truck #4",
      type: "HEAVY_TRUCK" as const,
      driver: "Vikram Singh",
      phoneExt: "Dispatch Ext: #204 (Heavy Freight Desk)",
      sosPhone: "1033",
      sosLabel: "NHAI Highway Breakdown SOS: 1033",
      dLat: -0.024,
      dLng: 0.035,
      speed: 52,
      battery: 89,
      packages: 142,
      capUtil: 94
    },
    {
      suffix: "CG-308",
      name: "Metro-Distribution Cargo Van #8",
      type: "CARGO_VAN" as const,
      driver: "Amit Sharma",
      phoneExt: "Dispatch Ext: #308 (Urban Logistics Desk)",
      sosPhone: "1077",
      sosLabel: "Disaster & Waterlogging SOS: 1077",
      dLat: -0.015,
      dLng: -0.022,
      speed: 29,
      battery: 64,
      packages: 48,
      capUtil: 72
    },
    {
      suffix: "EV-412",
      name: "CleanFleet Electric Urban Courier #12",
      type: "EV_VAN" as const,
      driver: "Pooja Verma",
      phoneExt: "Dispatch Ext: #412 (EV Fleet Hub)",
      sosPhone: "1800-209-5161",
      sosLabel: "EV Grid & Fast Charger Help: 1800-209-5161",
      dLat: 0.028,
      dLng: -0.018,
      speed: 42,
      battery: 81,
      packages: 29,
      capUtil: 58,
      temp: 3.8
    },
    {
      suffix: "2W-505",
      name: "Hyperlocal Quick-Commerce Two-Wheeler #5",
      type: "TWO_WHEELER" as const,
      driver: "Sanjay Patel",
      phoneExt: "Dispatch Ext: #505 (Express Dispatch)",
      sosPhone: "112",
      sosLabel: "National ERSS Emergency: 112",
      dLat: 0.005,
      dLng: 0.008,
      speed: 34,
      battery: 58,
      packages: 8,
      capUtil: 45
    },
    {
      suffix: "EV-619",
      name: "Cold-Chain Pharma Electric Sprinter #9",
      type: "EV_VAN" as const,
      driver: "Manoj Tiwari",
      phoneExt: "Dispatch Ext: #619 (Emergency Priority Desk)",
      sosPhone: "1095",
      sosLabel: `${city.name} Traffic Police SOS: 1095`,
      dLat: -0.032,
      dLng: 0.005,
      speed: 46,
      battery: 92,
      packages: 18,
      capUtil: 84,
      temp: -2.4
    }
  ];

  return vehicleTemplates.map((tpl, idx) => {
    const hub = hubs[idx % hubs.length] || { name: `${city.name} Central Depot` };
    const stop = stops[(idx * 2) % stops.length] || { name: `${city.name} Commercial Sector` };

    return {
      id: `${city.id.toUpperCase().slice(0, 3)}-${tpl.suffix}`,
      name: tpl.name,
      type: tpl.type,
      driver: tpl.driver,
      driverPhone: tpl.phoneExt,
      emergencyHelpline: tpl.sosPhone,
      emergencyHelplineLabel: tpl.sosLabel,
      status: (idx === 2 ? "DELAYED" : "ACTIVE") as any,
      battery_or_fuel_pct: tpl.battery,
      speed_kmh: tpl.speed,
      location_name: hub.name,
      lat: Number((centerLat + tpl.dLat).toFixed(6)),
      lng: Number((centerLng + tpl.dLng).toFixed(6)),
      route_id: `RT-${city.id.toUpperCase().slice(0, 3)}-${100 + idx}`,
      destination: stop.name,
      eta_min: 12 + idx * 4,
      capacity_utilization_pct: tpl.capUtil,
      packages_count: tpl.packages,
      temperature_control_c: tpl.temp,
      last_ping: new Date().toISOString()
    };
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get("city") || DEFAULT_CITY_ID;

  if (!cityFleetStore[cityId] || cityFleetStore[cityId].length === 0) {
    cityFleetStore[cityId] = generateDynamicFleetForCity(cityId);
  }

  // Add realistic micro-drift to coordinates & live telemetry pings
  const vehicles = cityFleetStore[cityId].map((v) => {
    const jitterLat = (Math.random() - 0.5) * 0.0004;
    const jitterLng = (Math.random() - 0.5) * 0.0004;
    const jitterSpeed = Math.round((Math.random() - 0.5) * 2);

    return {
      ...v,
      lat: Number((v.lat + jitterLat).toFixed(6)),
      lng: Number((v.lng + jitterLng).toFixed(6)),
      speed_kmh: Math.max(0, Math.min(80, v.speed_kmh + jitterSpeed)),
      last_ping: new Date().toISOString()
    };
  });

  cityFleetStore[cityId] = vehicles;

  return NextResponse.json({
    city: cityId,
    timestamp: new Date().toISOString(),
    total_vehicles: vehicles.length,
    active_count: vehicles.filter((v) => v.status === "ACTIVE").length,
    delayed_count: vehicles.filter((v) => v.status === "DELAYED").length,
    vehicles
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cityId = DEFAULT_CITY_ID, vehicleId, updates } = body;

    if (!cityFleetStore[cityId]) {
      cityFleetStore[cityId] = generateDynamicFleetForCity(cityId);
    }

    const idx = cityFleetStore[cityId].findIndex((v) => v.id === vehicleId);
    if (idx === -1) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    cityFleetStore[cityId][idx] = {
      ...cityFleetStore[cityId][idx],
      ...updates,
      last_ping: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      updated_vehicle: cityFleetStore[cityId][idx]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
