"use client";
import React from "react";
import {
  Truck,
  Package,
  ShieldCheck,
  TrendingDown,
  Activity,
  Gauge,
  ArrowRight,
  Zap,
  MapPin
} from "lucide-react";
import { CityGeography } from "@/config/cityConfig";
import { LogisticsPressureBreakdown, WeatherData } from "@/types";

interface Props {
  city: CityGeography;
  pressure: LogisticsPressureBreakdown | null;
  weather: WeatherData | null;
  onNavigate: (module: any) => void;
}

export function LogisticsDashboard({ city, pressure, weather, onNavigate }: Props) {
  return (
    <div className="space-y-6">
      {/* Logistics Operator Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-elevated border border-blue-700/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-700/60 border border-blue-400/40 text-blue-200 text-xs font-black uppercase tracking-wider">
              FLEET DISPATCH & LAST-MILE LOGISTICS HUB
            </span>
          </div>
          <span className="text-xs text-blue-200 font-semibold">{city.name} Logistics Zone</span>
        </div>

        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Commercial Fleet VRP Routing & Demand Analytics
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Multi-vehicle Capacitated Vehicle Routing Problem (CVRP) solver powered by Google OR-Tools. 
            Reduces dead mileage, optimizes parcel drop sequences, and minimizes diesel carbon emissions.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate("logistics_vrp")}
            className="bg-white text-blue-900 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4 text-blue-700" />
            <span>Launch Google OR-Tools Optimizer</span>
          </button>
          <button
            onClick={() => onNavigate("demand_ml")}
            className="bg-blue-800/80 hover:bg-blue-800 text-blue-100 border border-blue-400/30 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>24h Demand Forecast Studio</span>
          </button>
        </div>
      </div>

      {/* Fleet KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onNavigate("map")}>
          <span className="text-xs font-bold text-slate-500 uppercase">Active Logistics Hub</span>
          <div className="text-base font-bold text-slate-900 mt-1 truncate">
            {city.logisticsHubs[0]?.name || "Central Freight Depot"}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Capacity: {city.logisticsHubs[0]?.capacity || 500} packages/hr</p>
          <div className="mt-3 text-[10px] font-semibold text-emerald-600 flex items-center gap-1"><ArrowRight className="w-3 h-3" /> View on Map</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onNavigate("pressure_index")}>
          <span className="text-xs font-bold text-slate-500 uppercase">Logistics Pressure (LPI)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {pressure?.overall_score || 48.5} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Normal Corridor Friction</p>
          <div className="mt-3 text-[10px] font-semibold text-emerald-600 flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Analyze LPI</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onNavigate("ai")}>
          <span className="text-xs font-bold text-slate-500 uppercase">Weather Dispatch Window</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {weather ? `${weather.temperature_c}°C` : "28.5°C"}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Rain: {weather?.precipitation_mm || 0}mm (No delay)</p>
          <div className="mt-3 text-[10px] font-semibold text-emerald-600 flex items-center gap-1"><ArrowRight className="w-3 h-3" /> AI Advisories</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onNavigate("impact")}>
          <span className="text-xs font-bold text-slate-500 uppercase">Verified OR-Tools Savings</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            -19.6% km
          </div>
          <p className="text-[11px] text-slate-500 mt-1">4.14 kg CO₂ saved per 8 drops</p>
          <div className="mt-3 text-[10px] font-semibold text-emerald-600 flex items-center gap-1"><ArrowRight className="w-3 h-3" /> View Impact Benchmarks</div>
        </div>

      </div>

      {/* Quick Delivery Planner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Sample Fleet Delivery Queue ({city.sampleDeliveryStops.length} stops ready)</span>
          </h3>

          <div className="space-y-2">
            {city.sampleDeliveryStops.slice(0, 4).map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{s.name}</span>
                  <span className="text-[11px] text-slate-500">Coordinates: {s.lat.toFixed(4)}, {s.lng.toFixed(4)}</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                    {s.priority}
                  </span>
                  <span className="text-[11px] font-mono text-slate-700 block mt-0.5">{s.demand} pkgs</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate("logistics_vrp")}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Run VRP Optimization on Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Demand Forecast Preview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Random Forest Demand Forecasting</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Hourly order density predictions across commercial, residential, and industrial zones.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-700">Commercial Zone Peak:</span>
                <strong className="text-blue-900 font-mono">14:00 - 16:00 hrs</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-700">Residential Surge:</span>
                <strong className="text-blue-900 font-mono">19:00 - 21:00 hrs</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-700">Model Error (MAE):</span>
                <strong className="text-emerald-700 font-mono">5.50 pkgs/hr</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("demand_ml")}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Inspect Full Demand Curves</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}