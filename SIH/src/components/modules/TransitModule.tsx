"use client";
import React, { useState, useEffect } from "react";
import { Bus, Train, AlertCircle, Clock, CheckCircle2, Search, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { CityGeography } from "@/config/cityConfig";

interface Props {
  city: CityGeography;
}

export function TransitModule({ city }: Props) {
  const [transitData, setTransitData] = useState<any>(null);
  const [selectedMode, setSelectedMode] = useState<"ALL" | "Subway" | "Bus">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/transit?city=${city.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTransitData(data);
        if (data?.routes?.length > 0) {
          setSelectedRouteId(data.routes[0].id);
        }
      })
      .catch(console.error);
  }, [city]);

  const filteredRoutes = (transitData?.routes || []).filter((rt: any) => {
    if (selectedMode !== "ALL" && rt.mode !== selectedMode) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return rt.name.toLowerCase().includes(q) || rt.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Public Transit Network & GTFS Timetables
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official GTFS schedule specifications and real-time service advisories for {city.name}.
              </p>
            </div>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            GTFS Static Schedule Active
          </span>
        </div>

        {/* Agency Status Strip */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Transit Authority:</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{transitData?.agency?.name || city.transitAgency}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Live Bus GPS Tracking:</span>
            <div className="font-bold text-amber-700 mt-0.5">Unavailable from Source Feed</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">GTFS-RT Service Bulletins:</span>
            <div className="font-bold text-emerald-800 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Schedule
            </div>
          </div>
        </div>
      </div>

      {/* Mode Filters & Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedMode("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMode === "ALL" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Modes ({transitData?.routes?.length || 0})
          </button>
          <button
            onClick={() => setSelectedMode("Subway")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMode === "Subway" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Metro Lines
          </button>
          <button
            onClick={() => setSelectedMode("Bus")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMode === "Bus" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Trunk Bus Routes
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search line by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Transit Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoutes.map((rt: any) => {
          const isSelected = selectedRouteId === rt.id;
          return (
            <div
              key={rt.id}
              onClick={() => setSelectedRouteId(rt.id)}
              className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm ${
                isSelected
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-1 rounded-md text-xs font-black text-white shadow-xs"
                    style={{ backgroundColor: rt.color || "#059669" }}
                  >
                    {rt.id}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {rt.mode}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{rt.name}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Stations</span>
                    <strong className="text-slate-800 text-sm mt-0.5 block">{rt.stops_count} Stops</strong>
                  </div>
                  <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-emerald-800 block text-[10px] uppercase font-bold">Peak Frequency</span>
                    <strong className="text-emerald-950 text-sm mt-0.5 block">Every {rt.headway_min}m</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>GTFS Timetable</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  Active Schedule →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}