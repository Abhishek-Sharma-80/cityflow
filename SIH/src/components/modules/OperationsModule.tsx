"use client";
import React, { useState } from "react";
import {
  AlertOctagon,
  Truck,
  Building2,
  Bell,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  Check,
  UserCheck,
  CheckCheck,
  ChevronRight,
  Filter,
  X,
  MapPin,
  Flame,
  Radio
} from "lucide-react";
import { CityGeography } from "@/config/cityConfig";
import { IncidentReport } from "@/types";
import { FleetVehicle } from "@/data/fleetData";
import { PageHeader } from "@/components/ui/PageHeader";

interface Props {
  city: CityGeography;
  incidents: IncidentReport[];
  initialSubTab?: string;
  onIncidentUpdated: () => void;
  onNavigateToMap?: () => void;
}

export function OperationsModule({
  city,
  incidents,
  initialSubTab = "incidents",
  onIncidentUpdated,
  onNavigateToMap
}: Props) {
  const [activeTab, setActiveTab] = useState<"incidents" | "fleet" | "traffic" | "delivery" | "alerts">(
    (initialSubTab as any) || "incidents"
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Local state for instant optimistic UI updates on incidents
  const [localIncidents, setLocalIncidents] = useState<IncidentReport[]>(incidents);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);

  // Sync if parent updates
  React.useEffect(() => {
    setLocalIncidents(incidents);
  }, [incidents]);

  // Dynamic Fleet state
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);

  React.useEffect(() => {
    fetch(`/api/fleet?city=${city.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.vehicles) setFleetVehicles(data.vehicles);
      })
      .catch(console.error);
  }, [city.id]);

  // Action Handlers
  const handleAcknowledge = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLocalIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: "under_review" } : inc))
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status: "under_review" } : null));
    }
    await fetch("/api/incidents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "under_review" })
    });
    onIncidentUpdated();
  };

  const handleAssign = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLocalIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: "verified" } : inc))
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status: "verified" } : null));
    }
    await fetch("/api/incidents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "verified" })
    });
    onIncidentUpdated();
  };

  const handleResolve = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLocalIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: "resolved" } : inc))
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status: "resolved" } : null));
    }
    await fetch("/api/incidents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "resolved" })
    });
    onIncidentUpdated();
  };

  const filteredIncidents = localIncidents.filter((inc) => {
    if (severityFilter !== "ALL" && inc.severity !== severityFilter.toLowerCase()) return false;
    if (statusFilter !== "ALL" && inc.status !== statusFilter.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.location_name.toLowerCase().includes(q) ||
        inc.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="City Operations" 
        description="Manage incidents, fleet dispatch, and city operations in real-time"
        icon={Building2}
        breadcrumbs={[{ label: "Home" }, { label: "Operations" }]}
      />
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Operational Command & Dispatch Control
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live municipal incident moderation, dispatch task assignment, and traffic grid intervention in {city.name}.
            </p>
          </div>
        </div>

        {/* Operational Section Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("incidents")}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === "incidents"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Active Incidents ({localIncidents.filter((i) => i.status !== "resolved").length})
          </button>
          <button
            onClick={() => setActiveTab("fleet")}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === "fleet"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Fleet Operations ({fleetVehicles.length})
          </button>
          <button
            onClick={() => setActiveTab("traffic")}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === "traffic"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Traffic Operations
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === "alerts"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Alerts Feed
          </button>
        </div>
      </div>

      {/* SECTION 1: ACTIVE INCIDENTS */}
      {activeTab === "incidents" && (
        <div className="space-y-4">
          {/* Filters and Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                <span className="text-slate-400 text-[11px] px-2 font-bold uppercase">Severity:</span>
                {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                      severityFilter === sev
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                <span className="text-slate-400 text-[11px] px-2 font-bold uppercase">Status:</span>
                {["ALL", "REPORTED", "UNDER_REVIEW", "VERIFIED", "RESOLVED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                      statusFilter === st
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search incident by ID, road..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Incidents Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Location & Summary</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Severity</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Detected</th>
                    <th className="py-3.5 px-4 text-right">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No active incidents matching the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredIncidents.map((inc) => {
                      const isResolved = inc.status === "resolved";
                      const isVerified = inc.status === "verified";
                      const isReview = inc.status === "under_review";

                      return (
                        <tr
                          key={inc.id}
                          onClick={() => setSelectedIncident(inc)}
                          className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {inc.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{inc.location_name}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{inc.title}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700 capitalize">
                            {inc.category.replace("_", " ")}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                inc.severity === "critical"
                                  ? "bg-red-100 text-red-800"
                                  : inc.severity === "high"
                                  ? "bg-amber-100 text-amber-800"
                                  : inc.severity === "medium"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {inc.severity}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isResolved
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isVerified
                                  ? "bg-blue-100 text-blue-800"
                                  : isReview
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {inc.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(inc.reported_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                            {!isReview && !isVerified && !isResolved && (
                              <button
                                onClick={(e) => handleAcknowledge(inc.id, e)}
                                title="Acknowledge incident report"
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                              >
                                Acknowledge
                              </button>
                            )}

                            {!isVerified && !isResolved && (
                              <button
                                onClick={(e) => handleAssign(inc.id, e)}
                                title="Assign response patrol & verify"
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition"
                              >
                                Assign
                              </button>
                            )}

                            {!isResolved ? (
                              <button
                                onClick={(e) => handleResolve(inc.id, e)}
                                title="Mark hazard as cleared / resolved"
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
                              >
                                Resolve
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                                <Check className="w-3.5 h-3.5" /> Cleared
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FLEET OPERATIONS */}
      {activeTab === "fleet" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fleetVehicles.map((veh) => (
            <div
              key={veh.id}
              onClick={() => setSelectedVehicle(veh)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-1 rounded">
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

                <h3 className="font-bold text-slate-900 text-sm">{veh.name}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Speed / Battery</span>
                    <strong className="text-slate-800 text-xs mt-0.5 block">
                      {veh.speed_kmh} km/h • {veh.battery_or_fuel_pct}%
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
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
                <span className="text-emerald-700 font-bold">Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: TRAFFIC OPERATIONS */}
      {activeTab === "traffic" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Municipal Signal & Grid Synchronizer</h3>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Adaptive SCATS / Green-Wave Ready
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Automated green-wave signal timing adjustments calibrated dynamically against physical arterial chokepoints.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block uppercase">Inner Ring Road Corridor</span>
              <div className="text-xl font-bold text-slate-900 mt-1">90s Cycle (65s Green)</div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">Adaptive Boost Active</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block uppercase">DND Flyway Toll Ingress</span>
              <div className="text-xl font-bold text-slate-900 mt-1">Free Flow Vector</div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">Nominal Flow</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block uppercase">Ashram Chowk Intersection</span>
              <div className="text-xl font-bold text-slate-900 mt-1">120s Cycle (40s Green)</div>
              <span className="text-[11px] text-amber-700 font-semibold mt-1 inline-block">Congestion Throttle Active</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ALERTS FEED */}
      {activeTab === "alerts" && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Real-Time Municipal Broadcast Channel</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Live Telemetry Synchronized</span>
          </div>

          {[
            { id: "alt-1", title: "Yellow Line Peak Headway Boost", desc: "DMRC deployed 6-minute short-loop trains between Vishwavidyalaya and Central Secretariat.", time: "4 mins ago", sev: "INFO" },
            { id: "alt-2", title: "Heavy Commercial Truck Diverted via Peripheral Expressway", desc: "Freight diversion advisory active for heavy carriers heading towards Yamuna Expressway.", time: "12 mins ago", sev: "WARN" },
            { id: "alt-3", title: "Monsoon Pothole Repair Patrol Dispatched", desc: "Emergency road surface crew stationed at Okhla Phase III service lane.", time: "25 mins ago", sev: "INFO" }
          ].map((alt) => (
            <div key={alt.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${alt.sev === "WARN" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                    {alt.sev}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs">{alt.title}</h4>
                </div>
                <p className="text-xs text-slate-600">{alt.desc}</p>
              </div>
              <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">{alt.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* INCIDENT DETAILS DRAWER / MODAL */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">{selectedIncident.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    selectedIncident.severity === "critical"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedIncident.severity}
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{selectedIncident.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedIncident.location_name}</span>
              </p>
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
              {selectedIncident.description}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Estimated Delay</span>
                <strong className="text-slate-900 text-sm mt-0.5 block">18 mins delay</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">AI Recommendation</span>
                <strong className="text-emerald-800 text-xs mt-0.5 block">Use Barapullah Bypass</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedIncident(null);
                  if (onNavigateToMap) onNavigateToMap();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Locate on Map</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedIncident.status !== "resolved" ? (
                  <button
                    onClick={() => handleResolve(selectedIncident.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolve Hazard</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Cleared & Resolved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VEHICLE DETAILS DRAWER / MODAL */}
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
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Battery / Fuel</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{selectedVehicle.battery_or_fuel_pct}%</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Speed</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{selectedVehicle.speed_kmh} km/h</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Capacity Load</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{selectedVehicle.capacity_utilization_pct}%</strong>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Delivery Corridor</span>
              <p className="font-semibold text-slate-800">{selectedVehicle.location_name} → {selectedVehicle.destination}</p>
              <p className="text-[11px] text-slate-500">Manifest: {selectedVehicle.packages_count} parcels on board.</p>
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
