"use client";
import React, { useState } from "react";
import { Truck, Package, ShieldCheck, ArrowRight, Zap, TrendingDown, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { CityGeography } from "@/config/cityConfig";
import { VRPResult, LogisticsStop } from "@/types";

interface Props {
  city: CityGeography;
  onOptimizeComplete: (result: VRPResult) => void;
  onNavigateToMap: () => void;
}

export function LogisticsOptimizerModule({ city, onOptimizeComplete, onNavigateToMap }: Props) {
  const [depot, setDepot] = useState(city.logisticsHubs[0] || {
    id: "hub-0",
    name: "Central Logistics Hub",
    lat: city.center[0],
    lng: city.center[1],
    capacity: 500
  });

  const [stops, setStops] = useState<LogisticsStop[]>(city.sampleDeliveryStops || []);
  const [numVehicles, setNumVehicles] = useState<number>(2);
  const [vehicleCapacity, setVehicleCapacity] = useState<number>(80);
  const [loading, setLoading] = useState<boolean>(false);
  const [vrpResult, setVrpResult] = useState<VRPResult | null>(null);

  const handleRunOptimizer = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logistics/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depot,
          stops,
          num_vehicles: numVehicles,
          vehicle_capacity: vehicleCapacity
        })
      });

      if (res.ok) {
        const data: VRPResult = await res.json();
        setVrpResult(data);
        onOptimizeComplete(data);
      }
    } catch (err) {
      console.error("VRP optimization error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>Smart Delivery Logistics Optimizer</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Capacitated Vehicle Routing Problem (CVRP) solved with Google OR-Tools Guided Local Search metaheuristics.
            </p>
          </div>
          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            Google OR-Tools CVRP
          </span>
        </div>

        {/* Configuration Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Distribution Depot</label>
            <select
              value={depot.id}
              onChange={(e) => {
                const found = city.logisticsHubs.find((h) => h.id === e.target.value);
                if (found) setDepot(found);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {city.logisticsHubs.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Fleet Vehicles</label>
            <input
              type="number"
              min={1}
              max={6}
              value={numVehicles}
              onChange={(e) => setNumVehicles(parseInt(e.target.value) || 2)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Vehicle Payload Capacity (units)</label>
            <input
              type="number"
              min={20}
              max={300}
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(parseInt(e.target.value) || 80)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunOptimizer}
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 h-9"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>Run OR-Tools Solver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Baseline vs Optimized Comparison Results */}
      {vrpResult && (
        <div className="space-y-6">
          {/* Metrics Overview Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Distance Saved</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                {vrpResult.distance_saved_km} km
              </div>
              <span className="text-xs font-semibold text-emerald-700 mt-1 block">
                -{vrpResult.distance_saved_pct}% vs Naive Baseline
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Time Saved</span>
              <div className="text-2xl font-black text-blue-900 mt-1">
                {vrpResult.time_saved_minutes} mins
              </div>
              <span className="text-xs font-semibold text-blue-700 mt-1 block">
                Across {vrpResult.vehicles_used} Fleet Vehicles
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">CO₂ Emissions Saved</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                {vrpResult.co2_emissions_saved_kg} kg
              </div>
              <span className="text-xs font-semibold text-emerald-700 mt-1 block">
                Verified Diesel LCV Factor
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Algorithm</span>
                <div className="text-sm font-bold text-slate-800 mt-1">
                  Guided Local Search
                </div>
              </div>
              <button
                onClick={onNavigateToMap}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 mt-2"
              >
                <span>View Route Loops on GIS Map</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Vehicle Routes Table / Card List */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Optimized Vehicle Stop Sequences & Capacity Allocation</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vrpResult.routes.map((rt) => (
                <div key={rt.vehicle_id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      Vehicle #{rt.vehicle_id} Route Loop
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Payload: {rt.load_units} / {vehicleCapacity} units ({rt.capacity_utilization_pct}%)
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>Distance: <strong className="text-slate-800">{rt.distance_km} km</strong></span>
                    <span>Duration: <strong className="text-slate-800">{rt.estimated_duration_min} mins</strong></span>
                    <span>Stops: <strong className="text-slate-800">{rt.stops.length - 2} drops</strong></span>
                  </div>

                  {/* Stop list */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                    {rt.stops.map((st, idx) => (
                      <div key={`${st.id}-${idx}`} className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          st.type === "depot" ? "bg-emerald-700 text-white" : "bg-blue-600 text-white"
                        }`}>
                          {st.type === "depot" ? "D" : idx}
                        </span>
                        <span className="font-medium text-slate-800 truncate flex-1">{st.name}</span>
                        {st.demand > 0 && (
                          <span className="text-[11px] font-mono text-slate-500 font-semibold">{st.demand}u</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}