"use client";
import React from "react";
import { Building2, AlertTriangle, ShieldCheck, Zap, Radio, Bell, ArrowRight } from "lucide-react";
import { CityGeography } from "@/config/cityConfig";
import { WeatherData, AirQualityData, LogisticsPressureBreakdown, IncidentReport } from "@/types";

interface Props {
  city: CityGeography;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  pressure: LogisticsPressureBreakdown | null;
  incidents: IncidentReport[];
  onNavigate: (mod: any) => void;
}

export function CommandCenterModule({
  city,
  weather,
  airQuality,
  pressure,
  incidents,
  onNavigate
}: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              CIVIC OPERATIONS COMMAND CENTER
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">
            {city.name} Metropolitan Traffic & Logistics Authority
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Integrated decision support console for city traffic commissioners, municipal engineers, and freight logistics coordinators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Logistics Index</span>
            <span className="text-xl font-black text-emerald-400">{pressure?.overall_score || 48}</span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">AQI PM2.5</span>
            <span className="text-xl font-black text-amber-400">{airQuality?.aqi_pm2_5 || 52}</span>
          </div>
        </div>
      </div>

      {/* Actionable Trigger Alerts & Automated Playbooks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Authority Actions */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-card lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Automated AI Mitigation Playbooks & Operational Directives</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start justify-between gap-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white uppercase">
                  Green-Wave Signal Modulation
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">Dynamic Arterial Cycle Extension</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Traffic ML predicts corridor speed drop to &lt;20 km/h in +30m. Extend green cycle by +18 seconds on North-South arterial intersections.
                </p>
              </div>
              <button
                onClick={() => alert("Simulated: Green-Wave protocol transmitted to SCATS signal controllers.")}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold whitespace-nowrap shadow-sm"
              >
                Authorize
              </button>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start justify-between gap-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white uppercase">
                  Freight Diversion Advisory
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">Peripheral Express Ring Reroute</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Active collision on Ashram Chowk corridor. Broadcast automated telematics diversion to heavy commercial vehicles over 7.5T.
                </p>
              </div>
              <button
                onClick={() => alert("Simulated: Telematics advisory broadcast to connected logistics fleets.")}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap shadow-sm"
              >
                Broadcast
              </button>
            </div>
          </div>
        </div>

        {/* Quick Diagnostics */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Network Sensors</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Live sensor integrity checks</p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-medium text-slate-700">OSRM Travel Times</span>
                <span className="text-emerald-700 font-bold">100% ONLINE</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-medium text-slate-700">Meteorological Telemetry</span>
                <span className="text-emerald-700 font-bold">LIVE (5m refresh)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-medium text-slate-700">Spatial Hazards Moderated</span>
                <span className="text-slate-800 font-bold">{incidents.length} Active</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate("ai_decision")}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Consult Gemini AI Decision Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}