"use client";
import React, { useState } from "react";
import { AlertOctagon, Plus, ThumbsUp, CheckCircle, Clock, ShieldAlert, Filter, Search, X, Check, MapPin } from "lucide-react";
import { CityGeography } from "@/config/cityConfig";
import { IncidentReport } from "@/types";

interface Props {
  city: CityGeography;
  incidents: IncidentReport[];
  onIncidentReported: () => void;
}

export function IncidentModule({ city, incidents, onIncidentReported }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IncidentReport["category"]>("accident");
  const [severity, setSeverity] = useState<IncidentReport["severity"]>("high");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          severity,
          lat: city.center[0] + (Math.random() - 0.5) * 0.04,
          lng: city.center[1] + (Math.random() - 0.5) * 0.04,
          location_name: `${city.name} Central Arterial`,
          reported_by: "Field Incident Contributor"
        })
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        setShowModal(false);
        onIncidentReported();
      }
    } catch (err) {
      console.error("Incident submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id: string) => {
    await fetch("/api/incidents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, upvote: true })
    });
    onIncidentReported();
  };

  const handleVerify = async (id: string) => {
    await fetch("/api/incidents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "verified" })
    });
    onIncidentReported();
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity !== "ALL" && inc.severity !== filterSeverity.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return inc.title.toLowerCase().includes(q) || inc.location_name.toLowerCase().includes(q) || inc.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-50 text-red-700">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Spatial Incidents & Road Hazard Moderation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Citizen crowd-sourced and authority verified spatial hazard log for dynamic route recalculation in {city.name}.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Report Road Hazard</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterSeverity === sev
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident by road name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Incidents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIncidents.map((inc) => (
          <div
            key={inc.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    inc.severity === "critical"
                      ? "bg-red-100 text-red-800"
                      : inc.severity === "high"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {inc.severity} • {inc.category}
                </span>

                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(inc.reported_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{inc.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-50 p-2 rounded-lg border border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">{inc.location_name}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleUpvote(inc.id)}
                className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 font-bold bg-slate-50 hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-slate-200 transition"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{inc.upvotes} Confirmations</span>
              </button>

              <div className="flex items-center gap-2">
                {inc.status === "verified" ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                ) : (
                  <button
                    onClick={() => handleVerify(inc.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition"
                  >
                    Verify Incident
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Report Incident */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                <span>Report Road Obstruction</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Incident Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waterlogging under South Ext Flyover"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Details & Lane Impact</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe severity, blocked lanes, or surface condition..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Hazard Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="accident">Collision / Accident</option>
                    <option value="waterlogging">Waterlogging</option>
                    <option value="signal_issue">Signal Outage</option>
                    <option value="pothole">Pothole / Road Damage</option>
                    <option value="congestion">Traffic Chokepoint</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e: any) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="low">Low (Minor Delay)</option>
                    <option value="medium">Medium (Single Lane)</option>
                    <option value="high">High (Major Slowdown)</option>
                    <option value="critical">Critical (Road Blocked)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Broadcasting..." : "Broadcast Incident"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}