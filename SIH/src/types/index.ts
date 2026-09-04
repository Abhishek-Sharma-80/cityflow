export type SystemMode = "LIVE" | "SIMULATION";

export interface GeoCoordinate {
  lat: number;
  lng: number;
  label?: string;
}

export interface WeatherData {
  temperature_c: number;
  relative_humidity_pct: number;
  precipitation_mm: number;
  wind_speed_kmh: number;
  weather_code: number;
  weather_description: string;
  source: string;
  timestamp: string;
  status: "LIVE" | "RECENT" | "UNAVAILABLE";
}

export interface AirQualityData {
  aqi_pm2_5: number;
  aqi_pm10: number;
  no2_ugm3: number;
  co_ugm3: number;
  european_aqi: number;
  category: "GOOD" | "MODERATE" | "POOR" | "VERY_POOR" | "HAZARDOUS";
  source: string;
  timestamp: string;
  status: "LIVE" | "RECENT" | "UNAVAILABLE";
}

export interface TrafficSegmentPrediction {
  horizon: "15m" | "30m" | "60m";
  predicted_speed_kmh: number;
  congestion_index_pct: number;
  category: "FREE_FLOW" | "MODERATE" | "HEAVY" | "SEVERE";
  confidence_score: number;
  mae_kmh: number;
}

export interface DemandPrediction {
  hour: number;
  zone: string;
  predicted_demand: number;
  uncertainty_lower: number;
  uncertainty_upper: number;
  demand_level: "NORMAL" | "HIGH" | "PEAK";
  model_version: string;
}

export interface RouteOption {
  id: string;
  name: string;
  type: "FASTEST" | "LOWER_CONGESTION" | "LOWER_EMISSION" | "SHORTEST";
  distance_km: number;
  duration_min: number;
  congestion_factor: number; // 0 to 1
  estimated_co2_kg: number;
  score: number; // composite transparent score
  score_breakdown: {
    time_penalty: number;
    distance_penalty: number;
    congestion_penalty: number;
    emission_penalty: number;
  };
  geometry: [number, number][]; // [lat, lng]
  instructions: {
    instruction: string;
    distance_m: number;
    duration_s: number;
  }[];
}

export interface InfrastructurePoint {
  id: string;
  type: "parking" | "ev_charging" | "transit_stop" | "hub";
  name: string;
  lat: number;
  lng: number;
  capacity?: number;
  available_spaces?: number; // only if provided by source or labeled unavailable
  availability_status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE_FROM_SOURCE";
  operator?: string;
  tags?: Record<string, string>;
  source: string;
  timestamp: string;
}

export interface IncidentReport {
  id: string;
  category: "accident" | "road_blockage" | "pothole" | "signal_issue" | "congestion" | "waterlogging";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  lat: number;
  lng: number;
  location_name: string;
  reported_by: string;
  reported_at: string;
  status: "reported" | "under_review" | "verified" | "resolved" | "rejected";
  upvotes: number;
  source: "CITIZEN_APP" | "AUTHORITY_SENSOR" | "POLICE_CONTROL";
}

export interface LogisticsStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  demand: number;
  priority: "high" | "medium" | "low";
  time_window?: [string, string];
}

export interface LogisticsOptimizedRoute {
  vehicle_id: number;
  stops: (LogisticsStop & { type: "depot" | "stop" })[];
  distance_km: number;
  estimated_duration_min: number;
  load_units: number;
  capacity_utilization_pct: number;
}

export interface VRPResult {
  status: string;
  algorithm: string;
  depot: { id: string; name: string; lat: number; lng: number };
  vehicles_used: number;
  total_orders: number;
  baseline_distance_km: number;
  optimized_distance_km: number;
  distance_saved_km: number;
  distance_saved_pct: number;
  time_saved_minutes: number;
  co2_emissions_saved_kg: number;
  routes: LogisticsOptimizedRoute[];
}

export interface LogisticsPressureBreakdown {
  overall_score: number; // 0 to 100
  level: "LOW" | "MODERATE" | "ELEVATED" | "CRITICAL";
  timestamp: string;
  factors: {
    name: string;
    value: number;
    weight: number;
    weighted_contribution: number;
    source: string;
    status: string;
    description: string;
  }[];
}

export interface DataSourceStatus {
  id: string;
  name: string;
  category: string;
  provider: string;
  status: "LIVE" | "RECENT" | "STALE" | "DEGRADED" | "UNAVAILABLE";
  last_updated: string;
  latency_ms: number;
  record_count: number;
  error_rate_pct: number;
  data_type: "REALTIME_API" | "GIS_VECTOR" | "STATIC_GTFS" | "ML_INFERENCE";
  coverage: string;
}

export interface SystemHealthCheck {
  overall_status: "HEALTHY" | "DEGRADED" | "CRITICAL";
  timestamp: string;
  services: {
    name: string;
    status: "HEALTHY" | "DEGRADED" | "UNAVAILABLE";
    latency_ms: number;
    endpoint: string;
    details: string;
  }[];
}
export interface AIDecisionResponse {
  observation: string;
  evidence: string[];
  reasoning: string;
  recommendations: string[];
  data_limitations: string;
  confidence_pct: number;
  generated_at: string;
}

export type { FleetVehicle, AISpatialAdvisory } from "@/data/fleetData";

