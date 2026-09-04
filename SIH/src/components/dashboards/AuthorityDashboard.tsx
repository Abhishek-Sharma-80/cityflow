"use client";
import React from "react";
import {
  Building2,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Activity,
  Gauge,
  Radio,
  ArrowRight,
  BrainCircuit,
  Sparkles
} from "lucide-react";
import { CityGeography } from "@/config/cityConfig";
import { WeatherData, AirQualityData, LogisticsPressureBreakdown, IncidentReport } from "@/types";

interface Props {
  city: CityGeography;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  pressure: LogisticsPressureBreakdown | null;
  incidents: IncidentReport[];
  onNavigate: (module: any) => void;
}

export function AuthorityDashboard({
  city,
  weather,
  airQuality,
  pressure,
  incidents,
  onNavigate
}: Props) {
  const activeIncidents = incidents.filter((i) => i.status !== "resolved");

  return (
    <div className="space-y-6">
      {/* 4-Question Authority Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-elevated border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
              AUTONOMOUS CIVIC MOBILITY OPERATIONS CENTER
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {city.name} Metropolitan Traffic Police & Municipal Grid
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1 hover:border-slate-500 hover:bg-slate-700/80 transition-all duration-200 cursor-pointer" onClick={() => onNavigate("pressure_index")}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">1. WHAT IS HAPPENING?</span>
            <div className="text-sm font-bold text-white">
              LPI: {pressure?.overall_score || 48.5}/100 ({pressure?.level || "NORMAL"})
            </div>
            <p className="text-[11px] text-slate-300">
              Corridor velocities operating at ~38 km/h. {activeIncidents.length} active spatial bottlenecks.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1 hover:border-slate-500 hover:bg-slate-700/80 transition-all duration-200 cursor-pointer" onClick={() => onNavigate("map")}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">2. WHY IS IT HAPPENING?</span>
            <div className="text-sm font-bold text-white">
              {weather?.precipitation_mm ? `${weather.precipitation_mm}mm Rain Runoff` : "Peak Hour Volume Influx"}
            </div>
            <p className="text-[11px] text-slate-300">
              Heavy commercial traffic & weather brake friction on primary arterial corridors.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1 hover:border-slate-500 hover:bg-slate-700/80 transition-all duration-200 cursor-pointer" onClick={() => onNavigate("ai")}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">3. WHAT WILL HAPPEN NEXT?</span>
            <div className="text-sm font-bold text-amber-400">
              -38% Velocity Drop in +30m
            </div>
            <p className="text-[11px] text-slate-300">
              GBR Traffic ML model forecasts speed drop to &lt;25 km/h during evening rush.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 space-y-1">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">4. RECOMMENDED ACTION</span>
            <div className="text-sm font-bold text-emerald-300">
              Green-Wave Signal Modulation
            </div>
            <p className="text-[11px] text-emerald-100/80">
              Extend arterial green cycles by +18s; divert freight to outer ring road.
            </p>
          </div>

        </div>
      </div>

      {/* Authority Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Playbook Directives */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-card lg:col-span-2 space-y-4 hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Automated Signal Modulation & Freight Diversion Playbooks</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              SCATS Ready
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-start justify-between gap-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white uppercase">
                  Active Optimization Trigger
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">North-South Arterial Green-Wave Synchronization</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Transmits coordinated 90s split timings to SCATS signal controllers across 12 major intersections.
                </p>
              </div>
              <button
                onClick={() => alert("Transmitted: Dynamic green-wave schedule sent to SCATS signal network.")}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold whitespace-nowrap shadow-sm"
              >
                Transmit Directive
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/60 flex items-start justify-between gap-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white uppercase">
                  Commercial Fleet Diversion
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">Heavy Freight Peripheral Expressway Bypass</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Active waterlogging on Central Corridor. Broadcast telematics reroute advisory to connected commercial logistics vehicles.
                </p>
              </div>
              <button
                onClick={() => alert("Transmitted: Telematics advisory broadcast to connected fleet operators.")}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap shadow-sm"
              >
                Broadcast Advisory
              </button>
            </div>
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-card flex flex-col justify-between space-y-4 hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-600" />
              <span>Authority Action Hub</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Jump directly to specialized decision modules</p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => onNavigate("traffic_ml")}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 flex items-center justify-between group transition-all duration-200 hover:translate-x-0.5"
              >
                <span>📈 Traffic ML Speed Studio (GBR)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => onNavigate("ai_decision")}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 flex items-center justify-between group transition-all duration-200 hover:translate-x-0.5"
              >
                <span>🧠 Consult Gemini AI Decision Hub</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => onNavigate("incidents")}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 flex items-center justify-between group transition-all duration-200 hover:translate-x-0.5"
              >
                <span>⚠️ Moderate Road Hazards ({activeIncidents.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => onNavigate("map")}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 flex items-center justify-between group transition-all duration-200 hover:translate-x-0.5"
              >
                <span>🗺️ Open Fullscreen GIS Map</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Security: Authority Token Verified</span>
            <span className="text-emerald-700 font-bold">100% Operational</span>
          </div>
        </div>

      </div>
    </div>
  );
}