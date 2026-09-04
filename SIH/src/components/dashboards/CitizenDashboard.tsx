"use client";
import React from "react";
import {
  Navigation,
  Bus,
  AlertTriangle,
  CloudSun,
  Zap,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock
} from "lucide-react";
import { CityGeography } from "@/config/cityConfig";
import { WeatherData, AirQualityData, IncidentReport } from "@/types";

interface Props {
  city: CityGeography;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  incidents: IncidentReport[];
  onNavigate: (module: any) => void;
}

export function CitizenDashboard({ city, weather, airQuality, incidents, onNavigate }: Props) {
  const activeIncidents = incidents.filter((i) => i.status !== "resolved");

  return (
    <div className="space-y-6">
      {/* Commuter Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-elevated border border-teal-700/40 space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-teal-700/60 border border-teal-400/40 text-teal-200 text-xs font-black uppercase tracking-wider">
            CITIZEN MOBILITY & COMMUTE OS
          </span>
          <span className="text-xs text-teal-200 font-semibold">{city.name}</span>
        </div>

        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart Multi-Modal Travel & Public Transit
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Find the lowest-congestion, eco-optimized routes with real OSRM road geometry, DMRC transit headways, and crowd-sourced hazard alerts.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate("routing")}
            className="bg-white text-teal-900 hover:bg-teal-50 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Navigation className="w-4 h-4 text-teal-700" />
            <span>Plan Multi-Modal Route</span>
          </button>
          <button
            onClick={() => onNavigate("incidents")}
            className="bg-teal-800/80 hover:bg-teal-800 text-teal-100 border border-teal-400/30 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Report Road Hazard</span>
          </button>
        </div>
      </div>

      {/* Commute Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onNavigate("impact")}>
          <span className="text-xs font-bold text-slate-500 uppercase">Live Weather</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {weather ? `${weather.temperature_c}°C` : "28.5°C"}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{weather?.weather_description || "Clear Sky"}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onNavigate("impact")}>
          <span className="text-xs font-bold text-slate-500 uppercase">Air Quality (PM2.5)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {airQuality?.aqi_pm2_5 || 31.0} <span className="text-xs text-slate-400 font-normal">µg/m³</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Category: {airQuality?.category || "MODERATE"}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onNavigate("transit")}>
          <span className="text-xs font-bold text-slate-500 uppercase">Active Transit Agency</span>
          <div className="text-sm font-bold text-slate-900 mt-1 truncate">
            {city.transitAgency}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">GTFS Feeds Active</p>
          <div className="mt-3 text-[10px] font-semibold text-emerald-600 flex items-center gap-1"><ArrowRight className="w-3 h-3" /> View Routes</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onNavigate("incidents")}>
          <span className="text-xs font-bold text-slate-500 uppercase">Active Hazards</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {activeIncidents.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Moderated Bottlenecks</p>
          <div className="mt-3 text-[10px] font-semibold text-emerald-600 flex items-center gap-1"><ArrowRight className="w-3 h-3" /> View on Map</div>
        </div>

      </div>

      {/* Quick Transit & Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Transit Lines */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bus className="w-4 h-4 text-teal-600" />
              <span>Public Transit Lines & Headways</span>
            </h3>
            <button
              onClick={() => onNavigate("transit")}
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              View Full Timetable →
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                <span className="font-bold text-slate-900">Yellow Line (Metro)</span>
              </div>
              <span className="font-mono text-slate-600 font-semibold">3.5 min headway</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                <span className="font-bold text-slate-900">Blue Line (Metro)</span>
              </div>
              <span className="font-mono text-slate-600 font-semibold">4.0 min headway</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="font-bold text-slate-900">Route 522 (AC Bus)</span>
              </div>
              <span className="font-mono text-slate-600 font-semibold">10.0 min headway</span>
            </div>
          </div>
        </div>

        {/* Nearby Hazards */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Nearby Road Hazards & Waterlogging</span>
            </h3>
            <button
              onClick={() => onNavigate("incidents")}
              className="text-xs font-bold text-red-700 hover:underline"
            >
              Report Hazard →
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {activeIncidents.slice(0, 3).map((inc) => (
              <div key={inc.id} className="p-3 rounded-xl bg-red-50/50 border border-red-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{inc.title}</span>
                  <span className="text-[11px] text-slate-500">{inc.location_name}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                  {inc.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}