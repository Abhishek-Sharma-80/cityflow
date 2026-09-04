export interface FleetVehicle {
  id: string;
  name: string;
  type: "EV_VAN" | "CARGO_VAN" | "HEAVY_TRUCK" | "TWO_WHEELER";
  driver: string;
  driverPhone: string;
  emergencyHelpline: string;
  emergencyHelplineLabel: string;
  status: "ACTIVE" | "DELAYED" | "IDLE" | "CRITICAL";
  battery_or_fuel_pct: number;
  speed_kmh: number;
  location_name: string;
  lat: number;
  lng: number;
  route_id: string;
  destination: string;
  eta_min: number;
  capacity_utilization_pct: number;
  packages_count: number;
  temperature_control_c?: number;
  last_ping: string;
}

export interface AISpatialAdvisory {
  id: string;
  title: string;
  corridor: string;
  congestion_prob_pct: number;
  risk_level: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  recommended_action: string;
  impact_summary: string;
  units_affected: number;
  origin_dest: { from: string; to: string };
  suggested_route: string;
  status: "PENDING" | "APPLIED" | "DISMISSED";
  timestamp: string;
}
