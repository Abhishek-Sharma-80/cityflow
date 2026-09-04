"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  MapPin,
  Navigation as NavIcon,
  TrendingUp,
  Boxes,
  Truck,
  Gauge,
  Bus,
  Zap,
  AlertOctagon,
  Building2,
  BrainCircuit,
  Bell,
  Database,
  HeartPulse,
  BarChart3,
  ChevronDown,
  Layers,
  Radio,
  Sliders,
  ShieldAlert
} from "lucide-react";
import { UserRole } from "@/types/auth";

export type ModuleId =
  | "dashboard"
  | "map"
  | "routing"
  | "traffic_ml"
  | "demand_ml"
  | "logistics_vrp"
  | "pressure_index"
  | "transit"
  | "parking_ev"
  | "incidents"
  | "command_center"
  | "ai_decision"
  | "alerts"
  | "data_quality"
  | "api_health"
  | "impact"
  | "ai"
  | "operations";

export interface NavSubItem {
  id: ModuleId;
  label: string;
  description: string;
  icon: React.ElementType;
  allowedRoles: UserRole[];
  subTab?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  primaryModule: ModuleId;
  routePath: string;
  icon: React.ElementType;
  allowedRoles: UserRole[];
  items?: NavSubItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    primaryModule: "dashboard",
    routePath: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"]
  },
  {
    id: "map_transit",
    label: "Map & Transit",
    primaryModule: "map",
    routePath: "/map",
    icon: MapPin,
    allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"],
    items: [
      {
        id: "map",
        label: "Live City Map",
        description: "Interactive real-time map with infrastructure & traffic layers",
        icon: MapPin,
        allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"]
      },
      {
        id: "transit",
        label: "Public Transit Network",
        description: "DMRC GTFS multi-modal routes, metro lines, and schedules",
        icon: Bus,
        allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"]
      },
      {
        id: "parking_ev",
        label: "Parking & EV Hubs",
        description: "Verified municipal parking lots and fast DC charging stations",
        icon: Zap,
        allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"]
      },
      {
        id: "incidents",
        label: "Hazard Map Overlay",
        description: "Live spatial hazards, roadblocks, and flood zones",
        icon: AlertOctagon,
        allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"]
      }
    ]
  },
  {
    id: "routing_fleet",
    label: "Routing & Fleet",
    primaryModule: "routing",
    routePath: "/routing",
    icon: NavIcon,
    allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"],
    items: [
      {
        id: "routing",
        label: "Route Optimizer",
        description: "Multi-modal routing with congestion, ETA, and emission scoring",
        icon: NavIcon,
        allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"],
        subTab: "optimizer"
      },
      {
        id: "routing",
        label: "Fleet Operations",
        description: "Active delivery vehicles, live tracking, telemetry, and ETA",
        icon: Truck,
        allowedRoles: ["LOGISTICS_OPERATOR", "AUTHORITY"],
        subTab: "fleet"
      },
      {
        id: "logistics_vrp",
        label: "CVRP Dispatch Solver",
        description: "Google OR-Tools Capacitated Vehicle Routing Problem solver",
        icon: Boxes,
        allowedRoles: ["LOGISTICS_OPERATOR", "AUTHORITY"]
      }
    ]
  },
  {
    id: "ai_predictions",
    label: "AI & Predictions",
    primaryModule: "ai",
    routePath: "/ai",
    icon: BrainCircuit,
    allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"],
    items: [
      {
        id: "ai",
        label: "Traffic Prediction Studio",
        description: "Multi-horizon speed & congestion forecasting (30m, 60m, 120m)",
        icon: TrendingUp,
        allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"],
        subTab: "traffic"
      },
      {
        id: "ai",
        label: "AI Spatial Advisories",
        description: "Actionable corridor redirection & dispatch recommendations",
        icon: BrainCircuit,
        allowedRoles: ["LOGISTICS_OPERATOR", "AUTHORITY"],
        subTab: "advisories"
      },
      {
        id: "demand_ml",
        label: "Demand Forecasting",
        description: "24-hour parcel dispatch density and commercial surge models",
        icon: Boxes,
        allowedRoles: ["LOGISTICS_OPERATOR", "AUTHORITY"]
      },
      {
        id: "pressure_index",
        label: "Logistics Pressure Index",
        description: "Transparent multi-factor urban logistics chokepoint scoring",
        icon: Gauge,
        allowedRoles: ["LOGISTICS_OPERATOR", "AUTHORITY"]
      },
      {
        id: "ai_decision",
        label: "AI Decision Support",
        description: "Grounded situation reports and operational mitigation playbooks",
        icon: Radio,
        allowedRoles: ["AUTHORITY", "LOGISTICS_OPERATOR"]
      }
    ]
  },
  {
    id: "operations",
    label: "Operations",
    primaryModule: "operations",
    routePath: "/operations",
    icon: Building2,
    allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"],
    items: [
      {
        id: "operations",
        label: "Active Incidents Center",
        description: "Acknowledge, assign, and resolve road hazards and bottlenecks",
        icon: AlertOctagon,
        allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"],
        subTab: "incidents"
      },
      {
        id: "operations",
        label: "Fleet Control Console",
        description: "Real-time dispatch coordination, driver manifests, and tracking",
        icon: Truck,
        allowedRoles: ["LOGISTICS_OPERATOR", "AUTHORITY"],
        subTab: "fleet"
      },
      {
        id: "command_center",
        label: "Authority Command Center",
        description: "Metropolitan signal synchronization and grid interventions",
        icon: Building2,
        allowedRoles: ["AUTHORITY"]
      },
      {
        id: "alerts",
        label: "Real-time System Alerts",
        description: "Active weather, congestion, and dispatch notifications",
        icon: Bell,
        allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"]
      }
    ]
  },
  {
    id: "system_impact",
    label: "System & Impact",
    primaryModule: "impact",
    routePath: "/impact",
    icon: BarChart3,
    allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"],
    items: [
      {
        id: "impact",
        label: "Impact & Savings Benchmarks",
        description: "Dead mileage, carbon savings, and route efficiency metrics",
        icon: BarChart3,
        allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"],
        subTab: "impact"
      },
      {
        id: "impact",
        label: "System Health & APIs",
        description: "Live connectivity check for Open-Meteo, OSRM, and ML models",
        icon: HeartPulse,
        allowedRoles: ["CITIZEN", "LOGISTICS_OPERATOR", "AUTHORITY"],
        subTab: "health"
      },
      {
        id: "data_quality",
        label: "Data Quality Center",
        description: "Telemetry freshness, provenance ledger, and latency audit",
        icon: Database,
        allowedRoles: ["AUTHORITY"]
      }
    ]
  }
];

interface Props {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId, subTab?: string) => void;
  userRole?: UserRole;
}

export function Navigation({ activeModule, onSelectModule, userRole = "AUTHORITY" }: Props) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter groups according to active role
  const visibleGroups = NAV_GROUPS.filter((group) => group.allowedRoles.includes(userRole));

  const isGroupActive = (group: NavGroup) => {
    if (group.primaryModule === activeModule) return true;
    if (activeModule === "traffic_ml" || activeModule === "demand_ml" || activeModule === "pressure_index" || activeModule === "ai_decision") {
      if (group.id === "ai_predictions") return true;
    }
    if (activeModule === "logistics_vrp") {
      if (group.id === "routing_fleet") return true;
    }
    if (activeModule === "transit" || activeModule === "parking_ev") {
      if (group.id === "map_transit") return true;
    }
    if (activeModule === "incidents" || activeModule === "command_center" || activeModule === "alerts") {
      if (group.id === "operations") return true;
    }
    if (activeModule === "data_quality" || activeModule === "api_health") {
      if (group.id === "system_impact") return true;
    }
    return group.items?.some((item) => item.id === activeModule) || false;
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-xs" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1">
          {visibleGroups.map((group) => {
            const Icon = group.icon;
            const active = isGroupActive(group);
            const hasSubItems = group.items && group.items.filter((i) => i.allowedRoles.includes(userRole)).length > 0;
            const isOpen = openDropdown === group.id;

            return (
              <div key={group.id} className="relative flex items-center group">
                {/* Main clickable button */}
                <button
                  onClick={() => {
                    onSelectModule(group.primaryModule);
                    setOpenDropdown(null);
                  }}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-l-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    !hasSubItems ? "rounded-r-lg" : ""
                  } ${
                    active
                      ? "text-emerald-700 bg-emerald-50/50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${active ? "text-emerald-600" : "text-slate-500"}`} />
                  <span>{group.label}</span>
                  
                  {/* Badge for specific modules */}
                  {group.id === "operations" && (
                    <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                  )}
                  {group.id === "ai_predictions" && (
                    <span className="ml-1 px-1 py-0.5 text-[8px] leading-none bg-indigo-100 text-indigo-700 rounded uppercase font-bold">New</span>
                  )}

                  {/* Active Underline */}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"></div>
                  )}
                </button>

                {/* Separate dropdown toggle arrow */}
                {hasSubItems && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(isOpen ? null : group.id);
                    }}
                    title={`Open ${group.label} options`}
                    className={`px-1.5 py-1.5 rounded-r-lg text-xs transition-all ${
                      active
                        ? "text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100"
                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      } ${active ? "text-emerald-600" : "text-slate-400"}`}
                    />
                  </button>
                )}

                {/* Dropdown Menu */}
                {hasSubItems && isOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 sm:w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="space-y-0.5">
                      {group.items
                        ?.filter((item) => item.allowedRoles.includes(userRole))
                        .map((item, idx) => {
                          const SubIcon = item.icon;
                          const isSubActive = activeModule === item.id;
                          return (
                            <button
                              key={`${item.id}-${idx}`}
                              onClick={() => {
                                onSelectModule(item.id, item.subTab);
                                setOpenDropdown(null);
                              }}
                              className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                                isSubActive
                                  ? "bg-emerald-50 text-emerald-900 font-semibold"
                                  : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div
                                className={`p-1.5 rounded-md mt-0.5 ${
                                  isSubActive
                                    ? "bg-emerald-700 text-white"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                <SubIcon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold leading-tight">{item.label}</div>
                                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 leading-snug">
                                  {item.description}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Indicator: Active Workspace Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700">Enterprise Operating System</span>
        </div>
      </div>
    </nav>
  );
}