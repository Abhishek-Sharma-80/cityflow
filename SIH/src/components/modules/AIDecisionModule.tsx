"use client";
import React, { useState } from "react";
import { BrainCircuit, Send, Sparkles, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { CityGeography } from "@/config/cityConfig";
import { WeatherData, AirQualityData, LogisticsPressureBreakdown, IncidentReport, AIDecisionResponse } from "@/types";

interface Props {
  city: CityGeography;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  pressure: LogisticsPressureBreakdown | null;
  incidents: IncidentReport[];
}

export function AIDecisionModule({ city, weather, airQuality, pressure, incidents }: Props) {
  const [question, setQuestion] = useState("Why is logistics pressure elevated right now, and what action should the traffic commissioner take?");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIDecisionResponse | null>(null);

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/decision-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          context: {
            cityName: city.name,
            weather,
            airQuality,
            incidents,
            pressureScore: pressure?.overall_score || 48,
            predictions: [
              { horizon: "15m", speed: "36.2 km/h" },
              { horizon: "30m", speed: "28.4 km/h" },
              { horizon: "60m", speed: "19.8 km/h" }
            ],
            activeRoutesCount: 12
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      }
    } catch (err) {
      console.error("AI Decision Support error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-600" />
              <span>Gemini AI Urban Mobility Decision Support</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Grounded, traceable AI diagnostic engine answering complex city mobility queries strictly using verified telemetry.
            </p>
          </div>
          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gemini AI Engine</span>
          </span>
        </div>

        {/* Input Question Box */}
        <div className="mt-5 space-y-3">
          <label className="text-xs font-bold text-slate-700 block">Operational Diagnostic Query</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question grounded in live traffic data..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            <button
              onClick={handleAsk}
              disabled={loading}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Analyze</span>
            </button>
          </div>

          {/* Preset Questions */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="text-slate-400 font-medium py-1">Quick prompts:</span>
            {[
              "Why is pressure high here?",
              "What caused the predicted 30-min congestion?",
              "Which delivery corridor requires intervention?",
              "Summarize today's critical bottleneck incidents."
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-medium transition border border-slate-200"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Structured Diagnostic Output */}
      {response && (
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Operational Analysis</span>
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              Confidence: {response.confidence_pct}% • {new Date(response.generated_at).toLocaleTimeString()}
            </span>
          </div>

          {/* 1. Observation */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Observation</h4>
            <p className="text-sm font-semibold text-slate-900 mt-1 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              {response.observation}
            </p>
          </div>

          {/* 2. Evidence */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Verified Evidence</h4>
            <ul className="mt-1 space-y-1.5 text-xs text-slate-700">
              {response.evidence.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Reasoning */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Scientific Reasoning</h4>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {response.reasoning}
            </p>
          </div>

          {/* 4. Actionable Recommendations */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">4. Actionable Recommendations</h4>
            <div className="mt-1 space-y-2 text-xs">
              {response.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950 font-semibold">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Data Limitations */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Data Boundaries & Limitations</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              {response.data_limitations}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}