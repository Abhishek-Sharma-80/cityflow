"use client";

import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X, Search, Package, AlertTriangle, Zap, Bot, BarChart, ChevronRight, Sparkles } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (moduleId: string) => void;
  currentModule: string;
}

export function QuickActions({ onNavigate, currentModule }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const actions = [
    { 
      id: 'traffic', 
      title: 'Live Traffic & Map', 
      description: 'View real-time road conditions & GIS layers', 
      icon: Search, 
      action: () => onNavigate('map') 
    },
    { 
      id: 'incident', 
      title: 'Report Incident', 
      description: 'Log road hazards, accidents or waterlogging', 
      icon: AlertTriangle, 
      action: () => onNavigate('operations') 
    },
    { 
      id: 'ev', 
      title: 'Find EV Charging', 
      description: 'Locate nearby fast charging stations & parking', 
      icon: Zap, 
      action: () => onNavigate('parking_ev') 
    },
    { 
      id: 'ai', 
      title: 'AI Traffic Forecasts', 
      description: 'LightGBM speed & congestion predictions', 
      icon: BarChart, 
      action: () => onNavigate('ai') 
    },
    { 
      id: 'vrp', 
      title: 'Fleet Route Optimizer', 
      description: 'CVRP multi-vehicle dispatch with OR-Tools', 
      icon: Package, 
      action: () => onNavigate('logistics_vrp') 
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 border border-emerald-600/30"
        aria-label="Quick Actions & Shortcuts"
        title="Quick Actions"
      >
        <Sparkles size={18} className="text-emerald-200" />
      </button>

      {/* Slide-up Panel */}
      <div 
        ref={panelRef}
        className={`absolute bottom-14 left-0 w-84 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 flex flex-col transform transition-all duration-300 origin-bottom-left overflow-hidden ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-emerald-50/70">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-950">Quick Actions</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-200/60"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Action List */}
        <div className="p-2 space-y-1">
          {actions.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 hover:bg-emerald-50/70 rounded-xl transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 flex items-center justify-center shrink-0 transition-colors">
                <item.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-slate-900 group-hover:text-emerald-900 transition-colors">{item.title}</p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
              </div>
              <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
            <Bot size={13} className="text-emerald-600" />
            <span>Need AI advice? Click the Jim chat bubble on bottom right</span>
          </p>
        </div>
      </div>
    </div>
  );
}
