"use client";
import React, { useState } from "react";
import {
  BarChart3,
  TrendingDown,
  Leaf,
  Clock,
  Fuel,
  ShieldCheck,
  HeartPulse,
  Database,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Server,
  Layers
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";

interface Props {
  initialSubTab?: "impact" | "health";
  cityId?: string;
}

export function ImpactModule({ initialSubTab = "impact", cityId = "delhi" }: Props) {
  const [activeTab, setActiveTab] = useState<"impact" | "health">(initialSubTab);

  const [impactData, setImpactData] = useState<any>(null);
  const [healthServices, setHealthServices] = useState<any[]>([]);
  const [healthLoading, setHealthLoading] = useState(false);

  React.useEffect(() => {
    fetch(`/api/impact?city=${cityId}`)
      .then((res) => res.json())
      .then((data) => setImpactData(data))
      .catch(console.error);
  }, [cityId]);

  React.useEffect(() => {
    setHealthLoading(true);
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.services) setHealthServices(data.services);
      })
      .catch(console.error)
      .finally(() => setHealthLoading(false));
  }, []);

  const metrics = impactData?.metrics || {
    dead_mileage_reduction_pct: -19.6,
    route_efficiency_gain_pct: 23.1,
    avg_delay_reduced_min: 14.2,
    fleet_capacity_utilization_pct: 88.5
  };

  const chartData = impactData?.weekly_benchmark_chart || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="System Impact" 
        description="Track carbon savings, route efficiency, and system performance metrics"
        icon={BarChart3}
        breadcrumbs={[{ label: "Home" }, { label: "System & Impact" }]}
      />
      {/* Top Banner with SubTab Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              System Architecture & Operational Impact Studio
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live telemetry service health, mathematical benchmarks, and sustainable carbon reduction indicators.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab("impact")}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === "impact"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Impact & Benchmarks
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === "health"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            System & API Health
          </button>
        </div>
      </div>

      {/* TAB 1: OPERATIONAL IMPACT & BENCHMARKS */}
      {activeTab === "impact" && (
        <div className="space-y-6">
          {/* Simulated Disclaimer Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>DEMO / SIMULATED BENCHMARK DATA:</strong> Comparative metrics represent algorithmic simulations evaluated on Greater Delhi peak-hour demand models.
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded">
              Prototype Benchmark
            </span>
          </div>

          {/* High-Level Impact Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Dead Mileage Reduction
              </span>
              <div className="text-3xl font-black text-emerald-700">{metrics.dead_mileage_reduction_pct}%</div>
              <p className="text-xs text-slate-600">
                Elimination of driver backtracking and unnecessary empty transit loops.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Route Efficiency Gain
              </span>
              <div className="text-3xl font-black text-slate-900">+{metrics.route_efficiency_gain_pct}%</div>
              <p className="text-xs text-slate-600">
                Multi-order capacity utilization achieved through 2-Opt CVRP routing.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Average Transit Delay
              </span>
              <div className="text-3xl font-black text-blue-700">-{metrics.avg_delay_reduced_min} min</div>
              <p className="text-xs text-slate-600">
                Arterial chokepoint avoidance shifts vehicles onto free-flowing expressways.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Fleet Capacity Utilization
              </span>
              <div className="text-3xl font-black text-slate-900">{metrics.fleet_capacity_utilization_pct}%</div>
              <p className="text-xs text-slate-600">
                Balanced package payload across active urban electric vans.
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Comparative Fleet Kilometers: Naive FIFO vs CityFlow AI
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daily dynamic trajectory comparison evaluated via Google OR-Tools.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Google OR-Tools Guided Search
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      fontSize: "12px"
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="baseline_km" name="Naive Unoptimized (km)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="optimized_km" name="CityFlow Optimized (km)" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="dead_mileage_saved" name="Dead Mileage Saved (km)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM & UPSTREAM API HEALTH */}
      {activeTab === "health" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-600 animate-pulse" />
              <strong className="text-xs font-bold text-slate-800">
                Live Subsystems Latency & Health ({healthServices.length} Endpoints Active)
              </strong>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time Ping Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthServices.map((srv, idx) => {
              const isHealthy = srv.status === "HEALTHY" || srv.status === "LIVE";

              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {srv.category || "Core System Service"}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{srv.name}</h4>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        isHealthy
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isHealthy
                            ? "bg-emerald-600 animate-pulse"
                            : "bg-red-600"
                        }`}
                      ></span>
                      {srv.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded-xl border border-slate-100 truncate">
                    {srv.endpoint}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{srv.details}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Latency: {srv.latency_ms} ms</span>
                    <span className="text-emerald-700 font-semibold font-sans">99.9% Uptime SLA</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}