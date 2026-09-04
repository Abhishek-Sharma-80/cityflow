"use client";
import React, { useState, useEffect } from "react";
import { HeartPulse, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { SystemHealthCheck } from "@/types";

export function HealthModule() {
  const [health, setHealth] = useState<SystemHealthCheck | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error("Health check error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-card flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-600" />
            <span>System & Microservices Health Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ping verification for upstream routing, GIS overpass, weather telemetry, ML models, and OR-Tools solvers.
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Ping Services</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {health?.services.map((s, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{s.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                s.status === "HEALTHY" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}>
                {s.status}
              </span>
            </div>

            <p className="text-xs text-slate-600">{s.details}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Endpoint: {s.endpoint}</span>
              <span className="text-emerald-700 font-bold">{s.latency_ms} ms</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}