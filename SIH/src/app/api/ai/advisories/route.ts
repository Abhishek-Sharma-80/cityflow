import { NextRequest, NextResponse } from "next/server";
import { CITIES, DEFAULT_CITY_ID } from "@/config/cityConfig";
import { AISpatialAdvisory } from "@/data/fleetData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get("city") || DEFAULT_CITY_ID;
  const rainMm = parseFloat(searchParams.get("rain") || "0");
  const aqi = parseFloat(searchParams.get("aqi") || "140");
  const temp = parseFloat(searchParams.get("temp") || "32");
  const incidentCount = parseInt(searchParams.get("incidents") || "1", 10);

  const city = CITIES[cityId] || CITIES[DEFAULT_CITY_ID];
  const hubs = city.logisticsHubs || [];
  const stops = city.sampleDeliveryStops || [];

  const advisories: AISpatialAdvisory[] = [];

  // Advisory 1: Weather & Rain or Traffic Congestion
  if (rainMm > 2.0) {
    advisories.push({
      id: `ADV-${cityId.toUpperCase()}-001`,
      title: "Precipitation & Drainage Waterlogging Warning",
      corridor: `${stops[0]?.name || "Central Arterial"} ↔ ${stops[1]?.name || "Commercial Hub"}`,
      congestion_prob_pct: Math.min(96, Math.round(70 + rainMm * 4)),
      risk_level: rainMm > 8.0 ? "CRITICAL" : "HIGH",
      recommended_action: "Pre-emptively reroute freight vans to elevated outer ring expressway corridors.",
      impact_summary: `Severe rain accumulation (+${rainMm}mm) threatens delivery timelines across 12 scheduled drop-offs.`,
      units_affected: 12,
      origin_dest: {
        from: hubs[0]?.name || "Central Depot",
        to: stops[0]?.name || "Inner Circle"
      },
      suggested_route: "Elevated Bypass Expressway (Saves ~18m)",
      status: "PENDING",
      timestamp: new Date().toISOString()
    });
  } else {
    advisories.push({
      id: `ADV-${cityId.toUpperCase()}-001`,
      title: "Peak-Hour Radial Corridor Bottleneck",
      corridor: `${stops[0]?.name || "Central Corridor"} ↔ ${stops[1]?.name || "Commercial Hub"}`,
      congestion_prob_pct: Math.min(94, Math.round(62 + incidentCount * 5)),
      risk_level: incidentCount > 2 ? "HIGH" : "MODERATE",
      recommended_action: "Shift non-essential cargo batches by 35 minutes to bypass peak commuter congestion.",
      impact_summary: "High localized vehicle density detected near arterial transit junction.",
      units_affected: 14,
      origin_dest: {
        from: hubs[0]?.name || "Depot 1",
        to: stops[0]?.name || "City Center"
      },
      suggested_route: "Service Corridor Parallel Grid",
      status: "PENDING",
      timestamp: new Date().toISOString()
    });
  }

  // Advisory 2: Cold-Chain / High Temp
  if (temp > 35) {
    advisories.push({
      id: `ADV-${cityId.toUpperCase()}-002`,
      title: "Extreme Ambient Thermal Load on Cold-Chain Fleet",
      corridor: `${hubs[1]?.name || "Industrial Zone"} → ${stops[2]?.name || "Retail District"}`,
      congestion_prob_pct: 78,
      risk_level: "HIGH",
      recommended_action: "Prioritize pharma electric sprinters with active active reefer temperature monitoring.",
      impact_summary: `Ambient ${temp.toFixed(1)}°C accelerates battery thermal throttling by 18%.`,
      units_affected: 8,
      origin_dest: {
        from: hubs[1]?.name || "Pharma Hub",
        to: stops[2]?.name || "Hospital Complex"
      },
      suggested_route: "Direct Green Transit Vector",
      status: "PENDING",
      timestamp: new Date().toISOString()
    });
  } else {
    advisories.push({
      id: `ADV-${cityId.toUpperCase()}-002`,
      title: "EV Battery State Optimization & Depot Return",
      corridor: `${hubs[0]?.name || "Depot A"} → ${stops[3]?.name || "Suburban Hub"}`,
      congestion_prob_pct: 44,
      risk_level: "LOW",
      recommended_action: "Schedule Opportunity Fast Charging for EV vans with SoC below 30%.",
      impact_summary: "Optimal ambient temperatures allow full regenerative braking efficiency.",
      units_affected: 6,
      origin_dest: {
        from: hubs[0]?.name || "Depot A",
        to: stops[3]?.name || "Suburban Hub"
      },
      suggested_route: "Designated EV Transit Lane",
      status: "PENDING",
      timestamp: new Date().toISOString()
    });
  }

  // Advisory 3: AQI / Low Emission Zone Compliance
  if (aqi > 200) {
    advisories.push({
      id: `ADV-${cityId.toUpperCase()}-003`,
      title: "Severe Air Quality (GRAP-IV Emission Protocol)",
      corridor: `City-Wide Ultra Low Emission Zone (${city.name})`,
      congestion_prob_pct: 88,
      risk_level: "CRITICAL",
      recommended_action: "Restrict diesel freight entry into core municipal zone; substitute with 100% electric delivery fleet.",
      impact_summary: `AQI reaches ${Math.round(aqi)} (Severe). Municipal environmental mandates require immediate zero-emission compliance.`,
      units_affected: 26,
      origin_dest: {
        from: hubs[2]?.name || "Outer Logistics Ring",
        to: stops[4]?.name || "Heritage Commercial Zone"
      },
      suggested_route: "Outer Peripheral Expressway (Zero-Emission Feeder)",
      status: "PENDING",
      timestamp: new Date().toISOString()
    });
  } else {
    advisories.push({
      id: `ADV-${cityId.toUpperCase()}-003`,
      title: "Low Emission Zone Standard Trajectory Active",
      corridor: `${stops[4]?.name || "Central Avenue"} Corridor`,
      congestion_prob_pct: 35,
      risk_level: "LOW",
      recommended_action: "Maintain standard multi-drop delivery sequence.",
      impact_summary: `Air Quality Index is within baseline parameters (${Math.round(aqi)} AQI).`,
      units_affected: 9,
      origin_dest: {
        from: hubs[1]?.name || "Terminal 2",
        to: stops[4]?.name || "Central Square"
      },
      suggested_route: "Standard Navigation Grid",
      status: "PENDING",
      timestamp: new Date().toISOString()
    });
  }

  return NextResponse.json({
    city: city.name,
    city_id: city.id,
    timestamp: new Date().toISOString(),
    total_advisories: advisories.length,
    critical_count: advisories.filter((a) => a.risk_level === "CRITICAL").length,
    advisories
  });
}
