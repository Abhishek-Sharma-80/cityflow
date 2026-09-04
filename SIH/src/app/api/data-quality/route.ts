import { NextResponse } from "next/server";
import { DataSourceStatus } from "@/types";

export async function GET() {
  const dataSources: DataSourceStatus[] = [
    {
      id: "src-open-meteo-weather",
      name: "Open-Meteo Meteorology",
      category: "Environmental Telemetry",
      provider: "Open-Meteo API (ECMWF/GFS)",
      status: "LIVE",
      last_updated: new Date().toISOString(),
      latency_ms: 142,
      record_count: 1440,
      error_rate_pct: 0.0,
      data_type: "REALTIME_API",
      coverage: "Global 0.1° High-Resolution Grid"
    },
    {
      id: "src-open-meteo-aqi",
      name: "Copernicus Atmosphere Service (CAMS)",
      category: "Air Quality & Emissions",
      provider: "Open-Meteo Air Quality API",
      status: "LIVE",
      last_updated: new Date().toISOString(),
      latency_ms: 165,
      record_count: 24,
      error_rate_pct: 0.0,
      data_type: "REALTIME_API",
      coverage: "Urban Particulate & Chemical Dispersion"
    },
    {
      id: "src-osrm-routing",
      name: "Open Source Routing Machine (OSRM)",
      category: "GIS & Road Routing",
      provider: "OSRM Project Engine",
      status: "LIVE",
      last_updated: new Date().toISOString(),
      latency_ms: 88,
      record_count: 450000,
      error_rate_pct: 0.02,
      data_type: "REALTIME_API",
      coverage: "Full OpenStreetMap Road Network"
    },
    {
      id: "src-osm-overpass",
      name: "OpenStreetMap Infrastructure Overpass",
      category: "Urban Physical Amenities",
      provider: "Overpass API (OSM Foundation)",
      status: "LIVE",
      last_updated: new Date(Date.now() - 300000).toISOString(),
      latency_ms: 280,
      record_count: 8520,
      error_rate_pct: 0.0,
      data_type: "GIS_VECTOR",
      coverage: "Verified Municipal Amenity Tags"
    },
    {
      id: "src-gtfs-transit",
      name: "Urban Transit GTFS Schedule",
      category: "Public Transportation",
      provider: "DMRC / Municipal Transport Feed",
      status: "RECENT",
      last_updated: new Date(Date.now() - 3600000).toISOString(),
      latency_ms: 18,
      record_count: 1240,
      error_rate_pct: 0.0,
      data_type: "STATIC_GTFS",
      coverage: "Metro Lines & High-Frequency Bus Routes"
    },
    {
      id: "src-ml-traffic",
      name: "CityFlow GBR Traffic Model (v1.0.0)",
      category: "Machine Learning Intelligence",
      provider: "Gradient Boosting Regressor Inference",
      status: "LIVE",
      last_updated: new Date().toISOString(),
      latency_ms: 8,
      record_count: 6000,
      error_rate_pct: 0.0,
      data_type: "ML_INFERENCE",
      coverage: "15m, 30m, 60m Speed Horizons (MAE: 1.25 km/h)"
    },
    {
      id: "src-or-tools-vrp",
      name: "Google OR-Tools CVRP Solver",
      category: "Operations Research Engine",
      provider: "Google Optimization Tools (v9.15)",
      status: "LIVE",
      last_updated: new Date().toISOString(),
      latency_ms: 35,
      record_count: 150,
      error_rate_pct: 0.0,
      data_type: "ML_INFERENCE",
      coverage: "Multi-Vehicle Capacity & Route Optimization"
    }
  ];

  return NextResponse.json({ sources: dataSources });
}