"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";
import { SystemMode } from "@/types";

interface Props {
  mode: SystemMode;
}

export function SimulationBanner({ mode }: Props) {
  if (mode === "LIVE") return null;

  return (
    <div className="w-full bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs sm:text-sm font-bold tracking-wider flex items-center justify-center gap-2 border-b border-amber-600 shadow-inner animate-pulse">
      <AlertTriangle className="w-4 h-4 text-slate-950" />
      <span>⚠️ SIMULATION DATA — NOT LIVE • SCENARIO STRESS-TEST ACTIVE</span>
      <AlertTriangle className="w-4 h-4 text-slate-950" />
    </div>
  );
}