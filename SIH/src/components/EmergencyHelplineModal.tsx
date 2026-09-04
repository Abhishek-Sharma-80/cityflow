"use client";
import React, { useState, useEffect } from "react";
import { Phone, ShieldAlert, X, AlertTriangle, Bus, Zap, Car, ExternalLink, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cityId?: string;
}

export function EmergencyHelplineModal({ isOpen, onClose, cityId = "delhi" }: Props) {
  const [helplines, setHelplines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState("Delhi NCR");

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`/api/helplines?city=${cityId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.helplines) {
          setHelplines(data.helplines);
          setCityName(data.city);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen, cityId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-700">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official Transit & Emergency Helplines ({cityName})
              </h3>
              <p className="text-xs text-slate-500">
                Verified 24x7 control room hotlines for road emergencies, traffic breakdowns, and public transit.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Helpline Cards Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Fetching verified emergency hotlines for {cityName}...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {helplines.map((h, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded uppercase tracking-wider">
                  {h.category}
                </span>
                <h4 className="font-bold text-slate-900 text-xs mt-1.5 leading-snug">{h.name}</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">{h.purpose}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <a
                    href={`tel:${h.phone}`}
                    className="text-base font-black text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>{h.phone}</span>
                  </a>
                  {h.altPhone && (
                    <span className="text-[10px] text-slate-400 font-mono block">Alt: {h.altPhone}</span>
                  )}
                </div>

                <a
                  href={`tel:${h.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Official Government & Municipal Numbers (Toll-Free & 24x7)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
