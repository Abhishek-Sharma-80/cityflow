"use client";

import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Navigation, 
  BrainCircuit, 
  Building2, 
  BarChart3, 
  ArrowRight, 
  X, 
  Sparkles 
} from 'lucide-react';

interface OnboardingOverlayProps {
  userRole: 'AUTHORITY' | 'LOGISTICS_OPERATOR' | 'CITIZEN';
  userName: string;
  onDismiss: () => void;
}

export function OnboardingOverlay({ userRole, userName, onDismiss }: OnboardingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('cityflow_onboarding_seen');
    if (!hasSeen) {
      setIsRendered(true);
      // Small delay to allow for enter animation
      setTimeout(() => setIsVisible(true), 50);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('cityflow_onboarding_seen', 'true');
    setTimeout(() => {
      setIsRendered(false);
      onDismiss();
    }, 300); // Wait for exit animation
  };

  if (!isRendered) return null;

  const roleConfig = {
    AUTHORITY: { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'City Authority' },
    LOGISTICS_OPERATOR: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Logistics Operator' },
    CITIZEN: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Citizen' }
  };

  const role = roleConfig[userRole];

  const features = [
    {
      icon: <LayoutDashboard className="w-5 h-5 text-indigo-500" />,
      title: 'Dashboard',
      desc: 'Real-time city health metrics, weather, and traffic at a glance'
    },
    {
      icon: <MapPin className="w-5 h-5 text-rose-500" />,
      title: 'Map & Transit',
      desc: 'Interactive map with live traffic, incidents, EV stations & metro routes'
    },
    {
      icon: <Navigation className="w-5 h-5 text-emerald-500" />,
      title: 'Route Optimizer',
      desc: 'Plan optimal routes with congestion scoring and emission tracking'
    },
    {
      icon: <BrainCircuit className="w-5 h-5 text-purple-500" />,
      title: 'AI Predictions',
      desc: 'AI-powered traffic forecasting and smart corridor advisories'
    },
    {
      icon: <Building2 className="w-5 h-5 text-orange-500" />,
      title: 'Operations',
      desc: 'Manage incidents, fleet dispatch, and emergency coordination'
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-500" />,
      title: 'Impact',
      desc: 'Track carbon savings, efficiency gains, and system performance'
    }
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-6 border-b border-gray-100 bg-gradient-to-br from-indigo-50/50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome aboard, {userName}! 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">You are logged in as</span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${role.color}`}>
              {role.label}
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="p-8 bg-gray-50/50">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Explore CityFlow AI features</h2>
            <p className="text-gray-500 text-sm">Everything you need to navigate and manage the smart city.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-2">{feature.desc}</p>
                    <div className="text-xs font-medium text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white border-t border-gray-100 flex justify-end">
          <button
            onClick={handleDismiss}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Got it, let's explore!
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
