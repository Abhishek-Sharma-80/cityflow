"use client";
import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  ArrowRight,
  Radio,
  Share2,
  ExternalLink,
  Volume2,
  VolumeX
} from "lucide-react";
import { CityGeography } from "@/config/cityConfig";

interface Props {
  city: CityGeography;
  onNavigate?: (module: any) => void;
}

export function AlertsModule({ city, onNavigate }: Props) {
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "WEATHER" | "TRANSIT">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);

  const alerts = [
    {
      id: "alt-1",
      severity: "CRITICAL",
      category: "TRAFFIC",
      title: "Arterial Congestion Surge Forecast (+30m Horizon)",
      reason: "Gradient Boosting traffic model predicts speed drop below 18 km/h on North-South Expressway corridor due to peak hour volume surge.",
      source: "CityFlow LightGBM Model v1.0.0",
      timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
      actionLabel: "Optimize Signals",
      actionModule: "command_center",
      affectedArea: "Outer Ring Rd to Central Corridor"
    },
    {
      id: "alt-2",
      severity: "HIGH",
      category: "INCIDENT",
      title: "Commercial Freight Collision Blocking Carriageway",
      reason: "Multi-vehicle collision near Ashram Chowk intersection blocking 2 lanes. Traffic patrol dispatched; detour recommended.",
      source: "Citizen Patrol & CCTV Moderation Queue",
      timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
      actionLabel: "View on Map",
      actionModule: "map",
      affectedArea: "Ashram Chowk Underpass"
    },
    {
      id: "alt-3",
      severity: "MEDIUM",
      category: "WEATHER",
      title: "Precipitation Alert: Wet Road Friction Reduction",
      reason: "Open-Meteo telemetry reports rain showers (3.5 mm). Fleet operators advised to expand last-mile delivery windows by +15 mins.",
      source: "Open-Meteo Global Meteorological Feed",
      timestamp: new Date(Date.now() - 32 * 60000).toISOString(),
      actionLabel: "Adjust Fleet VRP",
      actionModule: "logistics_vrp",
      affectedArea: "Metropolitan Wide"
    },
    {
      id: "alt-4",
      severity: "INFO",
      category: "TRANSIT",
      title: "Transit Headway Boost on Yellow & Blue Lines",
      reason: "Additional short-loop subway rakes deployed between Vishwavidyalaya and Central Secretariat for evening commuter peak load.",
      source: "DMRC GTFS-RT Service Alert Feed",
      timestamp: new Date(Date.now() - 58 * 60000).toISOString(),
      actionLabel: "Transit Timetable",
      actionModule: "transit",
      affectedArea: "Line 2 & Line 3 Trunk Sectors"
    }
  ];

  const handleAcknowledge = (id: string) => {
    if (acknowledgedIds.includes(id)) {
      setAcknowledgedIds(acknowledgedIds.filter((i) => i !== id));
    } else {
      setAcknowledgedIds([...acknowledgedIds, id]);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "CRITICAL" && a.severity !== "CRITICAL") return false;
    if (filter === "HIGH" && a.severity !== "HIGH") return false;
    if (filter === "WEATHER" && a.category !== "WEATHER") return false;
    if (filter === "TRANSIT" && a.category !== "TRANSIT") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.reason.toLowerCase().includes(q) || a.affectedArea.toLowerCase().includes(q);
    }
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;
  const highCount = alerts.filter((a) => a.severity === "HIGH").length;
  const weatherCount = alerts.filter((a) => a.category === "WEATHER").length;
  const transitCount = alerts.filter((a) => a.category === "TRANSIT").length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Real-Time Operational Alerts</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Continuous automated anomaly detection across traffic flow, weather radar, and incident registries in {city.name}.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
            title="Toggle Alert Sounds"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-red-600" />}
            <span className="hidden md:inline">{soundEnabled ? "Audio On" : "Muted"}</span>
          </button>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{alerts.length} Active System Advisories</span>
          </span>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setFilter("CRITICAL")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filter === "CRITICAL"
              ? "bg-red-50/80 border-red-300 ring-2 ring-red-500/20 shadow-sm"
              : "bg-white border-slate-200 hover:border-red-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-red-700 uppercase">
            <span>Critical Surges</span>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{criticalCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Immediate intervention</div>
        </div>

        <div
          onClick={() => setFilter("HIGH")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filter === "HIGH"
              ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20 shadow-sm"
              : "bg-white border-slate-200 hover:border-amber-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-700 uppercase">
            <span>High Severity</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{highCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Physical obstructions</div>
        </div>

        <div
          onClick={() => setFilter("WEATHER")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filter === "WEATHER"
              ? "bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-sm"
              : "bg-white border-slate-200 hover:border-blue-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-blue-700 uppercase">
            <span>Weather Radar</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{weatherCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Rain & friction warnings</div>
        </div>

        <div
          onClick={() => setFilter("TRANSIT")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filter === "TRANSIT"
              ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm"
              : "bg-white border-slate-200 hover:border-emerald-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase">
            <span>Transit & GTFS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{transitCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Fleet frequency adjustments</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "ALL" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilter("CRITICAL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "CRITICAL" ? "bg-red-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setFilter("HIGH")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "HIGH" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            High Priority ({highCount})
          </button>
          <button
            onClick={() => setFilter("WEATHER")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "WEATHER" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Meteorology
          </button>
          <button
            onClick={() => setFilter("TRANSIT")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "TRANSIT" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Transit
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sector or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No matching advisories found for the selected filter.
          </div>
        ) : (
          filteredAlerts.map((a) => {
            const isAck = acknowledgedIds.includes(a.id);
            const borderLeftColor =
              a.severity === "CRITICAL"
                ? "border-l-red-500"
                : a.severity === "HIGH"
                ? "border-l-amber-500"
                : a.severity === "MEDIUM"
                ? "border-l-blue-500"
                : "border-l-emerald-500";

            return (
              <div
                key={a.id}
                className={`bg-white rounded-xl border border-slate-200 border-l-4 ${borderLeftColor} p-5 shadow-xs transition-all hover:shadow-sm ${
                  isAck ? "opacity-60 bg-slate-50/50" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          a.severity === "CRITICAL"
                            ? "bg-red-100 text-red-800"
                            : a.severity === "HIGH"
                            ? "bg-amber-100 text-amber-800"
                            : a.severity === "MEDIUM"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {a.severity}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(a.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {a.affectedArea}
                      </span>
                      {isAck && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Acknowledged
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mt-1">{a.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{a.reason}</p>
                    
                    <div className="text-[11px] text-slate-400 font-mono pt-1">
                      Origin: <span className="text-slate-600">{a.source}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start md:self-center shrink-0 pt-2 md:pt-0">
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate(a.actionModule)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>{a.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => handleAcknowledge(a.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        isAck
                          ? "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {isAck ? "Mark Unread" : "Acknowledge"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}