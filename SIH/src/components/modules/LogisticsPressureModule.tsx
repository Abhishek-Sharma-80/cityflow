"use client";
import React, { useState } from "react";
import { Gauge, CheckCircle2, ShieldAlert, Layers, ArrowRight, HelpCircle, X, Sparkles, Scale, Activity, Sliders } from "lucide-react";
import { LogisticsPressureBreakdown } from "@/types";

interface Props {
  pressure: LogisticsPressureBreakdown | null;
}

export function LogisticsPressureModule({ pressure }: Props) {
  const [showExplainModal, setShowExplainModal] = useState(false);

  if (!pressure) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Logistics Pressure Index (LPI) Explainability Center
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Deterministic multi-criteria scoring algorithm computing real-time infrastructure friction.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowExplainModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-xs flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Why is LPI {pressure.level}?</span>
            </button>
            <span className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
              pressure.level === "CRITICAL" ? "bg-red-100 text-red-800 border border-red-200" :
              pressure.level === "ELEVATED" ? "bg-amber-100 text-amber-800 border border-amber-200" :
              "bg-emerald-100 text-emerald-800 border border-emerald-200"
            }`}>
              {pressure.level} ({pressure.overall_score}/100)
            </span>
          </div>
        </div>

        {/* Big Score Hero Strip */}
        <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Citywide Multi-Criteria Index</span>
            <div className="text-4xl sm:text-5xl font-black text-slate-900">
              {pressure.overall_score} <span className="text-lg font-normal text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dynamically derived from physical corridor travel velocities ($35\%$), delivery order surges ($25\%$), active hazard blockages ($20\%$), meteorological drag ($10\%$), and public transit density ($10\%$).
            </p>
          </div>

          <div className="w-full lg:w-88 bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Mathematical Formulation:</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">100% Deterministic</span>
            </div>
            <div className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 text-center">
              LPI = 0.35·C + 0.25·D + 0.20·I + 0.10·W + 0.10·T
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Freshness: Live</span>
              <span>Total Weight: 1.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Factor Breakdown Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Factor Contributions & Source Traceability</span>
          </h3>
          <span className="text-xs text-slate-500">Sum of contributions = {pressure.overall_score} pts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pressure.factors.map((f, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{f.name}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                    Weight: {Math.round(f.weight * 100)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{f.value}</span>
                    <span className="text-xs text-slate-400">raw score</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +{f.weighted_contribution} pts to index
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, f.value)}%` }}
                  ></div>
                </div>

                <p className="text-xs text-slate-600 pt-1 leading-relaxed">{f.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate pr-2">Source: {f.source}</span>
                <span className="font-bold text-slate-700 uppercase bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                  {f.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explainability Modal */}
      {showExplainModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">LPI Explainability & Mathematical Provenance</h3>
                  <p className="text-xs text-slate-500">Step-by-step verifiable calculation</p>
                </div>
              </div>
              <button
                onClick={() => setShowExplainModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score Banner */}
            <div className="bg-emerald-50 p-4.5 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Composite Calculated Output</span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {pressure.overall_score} / 100 ({pressure.level})
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-900 bg-white px-3 py-1 rounded-lg border border-emerald-200">
                Weights Sum = 1.00
              </span>
            </div>

            {/* Calculations Step-by-Step */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Linear Combination Breakdown</h4>
              <div className="space-y-2 text-xs">
                {pressure.factors.map((f, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{f.name}</div>
                      <div className="text-[11px] text-slate-500">{f.value} raw × {f.weight} weight</div>
                    </div>
                    <div className="font-mono font-bold text-emerald-800 text-sm">
                      +{f.weighted_contribution}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowExplainModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition"
              >
                Close Breakdown
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}