"use client";
import React, { useState, useEffect } from "react";
import {
  Navigation,
  Car,
  Truck,
  Bike,
  Footprints,
  ArrowRight,
  Leaf,
  Shield,
  Clock,
  Gauge,
  Route as RouteIcon,
  Search,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Zap,
  Sliders,
  Filter,
  X,
  Package,
  Compass
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CityGeography } from "@/config/cityConfig";
import { RouteOption } from "@/types";
import { FleetVehicle } from "@/data/fleetData";

interface Props {
  city: CityGeography;
  initialTab?: "optimizer" | "fleet";
  onSelectRoute: (route: RouteOption) => void;
  onNavigateToMap: () => void;
}

interface GeocodingResult {
  name: string;
  lat: number;
  lng: number;
  type: string;
}

export function RoutingModule({
  city,
  initialTab = "optimizer",
  onSelectRoute,
  onNavigateToMap
}: Props) {
  const [activeTab, setActiveTab] = useState<"optimizer" | "fleet">(initialTab);

  // --- Route Optimization State ---
  const [originText, setOriginText] = useState("Connaught Place, Central Delhi");
  const [destText, setDestText] = useState("Noida Sector 62 IT Belt");
  const [vehicleType, setVehicleType] = useState<"EV_VAN" | "CARGO_VAN" | "HEAVY_TRUCK" | "TWO_WHEELER">("EV_VAN");
  const [priority, setPriority] = useState<"fastest" | "eco" | "balanced" | "no_toll">("fastest");
  
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number }>({
    lat: city.center[0] + 0.016,
    lng: city.center[1] + 0.008
  });
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number }>({
    lat: city.center[0] - 0.078,
    lng: city.center[1] + 0.052
  });

  const [mode, setMode] = useState<"driving" | "delivery" | "bike" | "foot">("delivery");
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // --- Fleet Operations State ---
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([]);
  const [fleetFilter, setFleetFilter] = useState<string>("ALL");
  const [fleetSearch, setFleetSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);

  // Dynamic Fleet Telemetry Fetching
  useEffect(() => {
    fetch(`/api/fleet?city=${city.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.vehicles) setFleetVehicles(data.vehicles);
      })
      .catch(console.error);
  }, [city.id]);

  // Update default coordinates when city changes
  useEffect(() => {
    setOriginCoords({ lat: city.center[0] + 0.016, lng: city.center[1] + 0.008 });
    setDestCoords({ lat: city.center[0] - 0.078, lng: city.center[1] + 0.052 });
    setOriginText(`${city.name} Central Hub`);
    setDestText(`${city.name} Commercial Sector`);
    setRoutes([]);
  }, [city]);

  const handleComputeRoutes = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/routing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: { lat: originCoords.lat, lng: originCoords.lng, label: originText },
          destination: { lat: destCoords.lat, lng: destCoords.lng, label: destText },
          mode: vehicleType === "TWO_WHEELER" ? "bike" : "driving"
        })
      });

      if (!res.ok) {
        throw new Error("Failed to compute multi-modal routes");
      }

      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        setRoutes(data.routes);
        setSelectedRouteId(data.routes[0].id);
        onSelectRoute(data.routes[0]);
      } else {
        throw new Error("No navigable corridors found between specified waypoints.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Routing engine connection error.");
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = fleetVehicles.filter((v) => {
    if (fleetFilter !== "ALL" && v.status !== fleetFilter) return false;
    if (fleetSearch) {
      const q = fleetSearch.toLowerCase();
      return (
        v.id.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.driver.toLowerCase().includes(q) ||
        v.location_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Route Optimizer & Fleet" 
        description="Plan optimal routes with real-time congestion, emissions & ETA scoring"
        icon={Navigation}
        breadcrumbs={[{ label: "Home" }, { label: "Routing & Fleet" }]}
      />

      {/* Top Banner with Tab Navigation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <RouteIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Multi-Modal Routing & Fleet Dispatch Center
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Turn-by-turn trajectory optimization, vehicle telematics, and dead-mileage reduction across {city.name}.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab("optimizer")}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === "optimizer"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Route Optimization
          </button>
          <button
            onClick={() => setActiveTab("fleet")}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === "fleet"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Fleet Operations ({fleetVehicles.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ROUTE OPTIMIZATION */}
      {activeTab === "optimizer" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Input Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Waypoints & Constraints</span>
            </h3>

            {/* Origin Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Origin Point</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={originText}
                  onChange={(e) => setOriginText(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Destination Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Destination Point</label>
              <div className="relative">
                <Compass className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={destText}
                  onChange={(e) => setDestText(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="EV_VAN">Electric Courier Van (Zero Emission)</option>
                <option value="CARGO_VAN">Standard Urban Cargo Van</option>
                <option value="HEAVY_TRUCK">Heavy Freight Truck</option>
                <option value="TWO_WHEELER">Two-Wheeler EV Express Courier</option>
              </select>
            </div>

            {/* Optimization Priority */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Routing Objective</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="fastest">Fastest Travel Time (Speed Optimized)</option>
                <option value="eco">Eco-Route (Lowest Emissions & Toll Bypass)</option>
                <option value="balanced">Balanced Corridor & Low Congestion</option>
              </select>
            </div>

            <button
              onClick={handleComputeRoutes}
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Solving Trajectories...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Optimize Route</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Routes Display Area */}
          <div className="lg:col-span-2 space-y-4">
            {routes.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
                <RouteIcon className="w-10 h-10 text-emerald-600 mx-auto opacity-40" />
                <h4 className="text-base font-bold text-slate-800">Ready to Compute Optimal Trajectories</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click <strong>Optimize Route</strong> to calculate real-world OSRM routes, traffic friction coefficients, and fuel/carbon metrics across Greater Delhi.
                </p>
                <button
                  onClick={handleComputeRoutes}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Launch Trajectory Solver</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Generated Route Alternatives ({routes.length})
                  </span>
                  <button
                    onClick={onNavigateToMap}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>View on Full Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {routes.map((rt, idx) => {
                    const isSelected = selectedRouteId === rt.id;
                    const isRecommended = idx === 0;

                    return (
                      <div
                        key={rt.id}
                        onClick={() => {
                          setSelectedRouteId(rt.id);
                          onSelectRoute(rt);
                        }}
                        className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all shadow-xs ${
                          isSelected
                            ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {isRecommended && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
                                  ★ RECOMMENDED ROUTE
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {rt.type}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mt-1">{rt.name}</h4>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-black text-slate-900">{rt.duration_min} <span className="text-xs font-normal text-slate-500">mins</span></div>
                            <div className="text-xs text-slate-500 font-semibold">{rt.distance_km} km</div>
                          </div>
                        </div>

                        {/* Performance Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-100 text-xs">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-slate-400 text-[10px] block uppercase font-bold">Traffic Impact</span>
                            <strong className="text-slate-800 text-xs mt-0.5 block">{Math.round(rt.congestion_factor * 100)}% Congestion</strong>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-slate-400 text-[10px] block uppercase font-bold">Estimated CO₂</span>
                            <strong className="text-emerald-800 text-xs mt-0.5 block">{rt.estimated_co2_kg} kg CO₂</strong>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-slate-400 text-[10px] block uppercase font-bold">Dead Mileage</span>
                            <strong className="text-slate-800 text-xs mt-0.5 block">0.8 km minimized</strong>
                          </div>
                          <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                            <span className="text-emerald-800 text-[10px] block uppercase font-bold">Efficiency Score</span>
                            <strong className="text-emerald-950 text-sm mt-0.5 block">{rt.score} / 100</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FLEET OPERATIONS */}
      {activeTab === "fleet" && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <span className="text-slate-400 text-[11px] px-2 font-bold uppercase">Status:</span>
              {["ALL", "ACTIVE", "DELAYED", "IDLE", "CRITICAL"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFleetFilter(st)}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${
                    fleetFilter === st
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vehicle ID, driver..."
                value={fleetSearch}
                onChange={(e) => setFleetSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((veh) => (
              <div
                key={veh.id}
                onClick={() => setSelectedVehicle(veh)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2.5 py-1 rounded-lg">
                      {veh.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        veh.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : veh.status === "DELAYED"
                          ? "bg-amber-100 text-amber-800"
                          : veh.status === "CRITICAL"
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {veh.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{veh.name}</h3>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Speed / Battery</span>
                      <strong className="text-slate-800 text-xs mt-0.5 block">
                        {veh.speed_kmh} km/h • {veh.battery_or_fuel_pct}%
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination ETA</span>
                      <strong className="text-emerald-800 text-xs mt-0.5 block">{veh.eta_min} mins</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Current Location</span>
                    <p className="font-medium text-slate-800 line-clamp-1">{veh.location_name}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Driver: <strong>{veh.driver}</strong></span>
                  <span className="text-emerald-700 font-bold">Full Telemetry →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VEHICLE DETAILS MODAL */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800">{selectedVehicle.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    selectedVehicle.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedVehicle.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{selectedVehicle.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assigned Driver: <strong>{selectedVehicle.driver}</strong> • {selectedVehicle.driverPhone}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Battery Charge</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{selectedVehicle.battery_or_fuel_pct}%</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Speed</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{selectedVehicle.speed_kmh} km/h</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Load Units</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{selectedVehicle.capacity_utilization_pct}%</strong>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Corridor</span>
              <p className="font-semibold text-slate-800">{selectedVehicle.location_name} → {selectedVehicle.destination}</p>
              <p className="text-[11px] text-slate-500">Manifest: {selectedVehicle.packages_count} active orders on board.</p>
            </div>

            {/* Official Emergency Helpline Bar */}
            <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Transit Control Helpline</span>
                <span className="font-bold text-emerald-950 text-xs">{selectedVehicle.emergencyHelplineLabel || "National Emergency Helpline"}</span>
              </div>
              <a
                href={`tel:${selectedVehicle.emergencyHelpline || "112"}`}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
              >
                <span>Call SOS ({selectedVehicle.emergencyHelpline || "112"})</span>
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}