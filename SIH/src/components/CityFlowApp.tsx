"use client";
import React, { useState, useEffect } from "react";
import { CITIES, DEFAULT_CITY_ID, CityGeography } from "@/config/cityConfig";
import { Header } from "@/components/Header";
import { Navigation, ModuleId } from "@/components/Navigation";
import { SimulationBanner } from "@/components/SimulationBanner";
import { LandingHero } from "@/components/LandingHero";
import { AuthModal } from "@/components/auth/AuthModal";
import { EmergencyHelplineModal } from "@/components/EmergencyHelplineModal";
import { AIChatbotWidget } from "@/components/chat/AIChatbotWidget";
import { OnboardingOverlay } from "@/components/OnboardingOverlay";
import { QuickActions } from "@/components/ui/QuickActions";

import { DashboardModule } from "@/components/modules/DashboardModule";
import { MapModule } from "@/components/modules/MapModule";
import { RoutingModule } from "@/components/modules/RoutingModule";
import { LogisticsOptimizerModule } from "@/components/modules/LogisticsOptimizerModule";
import { AIPredictionsModule } from "@/components/modules/AIPredictionsModule";
import { OperationsModule } from "@/components/modules/OperationsModule";
import { ImpactModule } from "@/components/modules/ImpactModule";

import { TrafficMLModule } from "@/components/modules/TrafficMLModule";
import { DemandMLModule } from "@/components/modules/DemandMLModule";
import { LogisticsPressureModule } from "@/components/modules/LogisticsPressureModule";
import { TransitModule } from "@/components/modules/TransitModule";
import { ParkingEVModule } from "@/components/modules/ParkingEVModule";
import { IncidentModule } from "@/components/modules/IncidentModule";
import { CommandCenterModule } from "@/components/modules/CommandCenterModule";
import { AIDecisionModule } from "@/components/modules/AIDecisionModule";
import { AlertsModule } from "@/components/modules/AlertsModule";
import { DataQualityModule } from "@/components/modules/DataQualityModule";
import { HealthModule } from "@/components/modules/HealthModule";

import { AuthorityDashboard } from "@/components/dashboards/AuthorityDashboard";
import { LogisticsDashboard } from "@/components/dashboards/LogisticsDashboard";
import { CitizenDashboard } from "@/components/dashboards/CitizenDashboard";

import {
  SystemMode,
  WeatherData,
  AirQualityData,
  LogisticsPressureBreakdown,
  IncidentReport,
  InfrastructurePoint,
  RouteOption,
  VRPResult
} from "@/types";
import { UserProfile, UserRole, AuthSession } from "@/types/auth";
import { calculateLogisticsPressureIndex } from "@/lib/pressure-calculator";

interface Props {
  initialModule?: ModuleId;
}

export function CityFlowApp({ initialModule = "dashboard" }: Props) {
  const [selectedCity, setSelectedCity] = useState<CityGeography>(CITIES[DEFAULT_CITY_ID]);
  const [mode, setMode] = useState<SystemMode>("LIVE");
  const [activeModule, setActiveModule] = useState<ModuleId>(initialModule);
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [defaultAuthRole, setDefaultAuthRole] = useState<UserRole>("AUTHORITY");
  const [helplineModalOpen, setHelplineModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Telemetry & Data States
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [pressure, setPressure] = useState<LogisticsPressureBreakdown | null>(null);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructurePoint[]>([]);

  // Shared State between Map, Route Planner, and VRP Optimizer
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null);
  const [vrpResult, setVrpResult] = useState<VRPResult | null>(null);

  // Restore Session on Mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem("cityflow_auth_session");
      if (savedSession) {
        const parsed: AuthSession = JSON.parse(savedSession);
        if (new Date(parsed.expiresAt) > new Date()) {
          setCurrentUser(parsed.user);
          setAuthToken(parsed.token);
        } else {
          localStorage.removeItem("cityflow_auth_session");
        }
      }
    } catch {
      localStorage.removeItem("cityflow_auth_session");
    }
  }, []);

  // Sync with browser URL changes and handle direct navigation
  useEffect(() => {
    const routeMap: Record<string, ModuleId> = {
      "/dashboard": "dashboard",
      "/map": "map",
      "/routing": "routing",
      "/ai": "ai",
      "/operations": "operations",
      "/impact": "impact"
    };

    const pathname = window.location.pathname;
    if (routeMap[pathname]) {
      setActiveModule(routeMap[pathname]);
    }

    const handlePopState = () => {
      const p = window.location.pathname;
      if (routeMap[p]) {
        setActiveModule(routeMap[p]);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Navigation Handler with URL sync
  const handleSelectModule = (id: ModuleId, subTab?: string) => {
    setActiveModule(id);
    setActiveSubTab(subTab);

    const moduleToPath: Record<string, string> = {
      dashboard: "/dashboard",
      map: "/map",
      routing: "/routing",
      ai: "/ai",
      traffic_ml: "/ai",
      demand_ml: "/ai",
      pressure_index: "/ai",
      ai_decision: "/ai",
      operations: "/operations",
      incidents: "/operations",
      command_center: "/operations",
      alerts: "/operations",
      impact: "/impact",
      data_quality: "/impact",
      api_health: "/impact",
      transit: "/map",
      parking_ev: "/map",
      logistics_vrp: "/routing"
    };

    const targetPath = moduleToPath[id] || "/dashboard";
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  };

  const handleAuthSuccess = (session: AuthSession) => {
    setCurrentUser(session.user);
    setAuthToken(session.token);
    try {
      localStorage.setItem("cityflow_auth_session", JSON.stringify(session));
      if (!localStorage.getItem("cityflow_onboarding_seen")) {
        setShowOnboarding(true);
      }
    } catch {}
    handleSelectModule("dashboard");
  };

  const handleLogout = async () => {
    try {
      if (authToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` }
        });
      }
    } catch {}
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem("cityflow_auth_session");
  };

  const handleDemoAccess = async (role: UserRole) => {
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        const data = await res.json();
        handleAuthSuccess(data.session);
      }
    } catch (err) {
      console.error("Demo launch error:", err);
    }
  };

  const handleSwitchRole = async (newRole: UserRole) => {
    await handleDemoAccess(newRole);
  };

  // Telemetry Fetchers
  const fetchEnvironmentalTelemetry = async (city: CityGeography) => {
    try {
      const res = await fetch(`/api/weather?lat=${city.center[0]}&lng=${city.center[1]}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data.weather);
        setAirQuality(data.airQuality);
      }
    } catch (err) {
      console.error("Telemetry error:", err);
    }
  };

  const fetchIncidents = async () => {
    try {
      const res = await fetch("/api/incidents");
      if (res.ok) {
        const data = await res.json();
        setIncidents(data.incidents || []);
      }
    } catch (err) {
      console.error("Incidents fetch error:", err);
    }
  };

  const fetchInfrastructure = async (city: CityGeography) => {
    try {
      const [minLat, minLng, maxLat, maxLng] = city.bbox;
      const res = await fetch(
        `/api/infrastructure?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`
      );
      if (res.ok) {
        const data = await res.json();
        setInfrastructure(data.points || []);
      }
    } catch (err) {
      console.error("Infrastructure fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEnvironmentalTelemetry(selectedCity);
    fetchIncidents();
    fetchInfrastructure(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    if (weather) {
      const lpi = calculateLogisticsPressureIndex(38.5, 95.0, incidents, weather);
      setPressure(lpi);
    }
  }, [weather, incidents]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Simulation Banner */}
      <SimulationBanner mode={mode} />

      {/* Header Bar */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        mode={mode}
        onToggleMode={(m) => setMode(m)}
        currentUser={currentUser}
        onOpenAuth={(m) => {
          setAuthModalMode(m);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onOpenHelplines={() => setHelplineModalOpen(true)}
      />

      {/* Emergency Helpline Directory Modal */}
      <EmergencyHelplineModal
        isOpen={helplineModalOpen}
        onClose={() => setHelplineModalOpen(false)}
        cityId={selectedCity.id}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        defaultRole={defaultAuthRole}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Navigation Bar (Role Filtered) */}
      {currentUser && (
        <Navigation
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
          userRole={currentUser.role}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!currentUser ? (
          /* Unauthenticated Landing Flow */
          <LandingHero
            city={selectedCity}
            weather={weather}
            airQuality={airQuality}
            pressure={pressure}
            onOpenAuth={(m, role) => {
              setAuthModalMode(m);
              if (role) setDefaultAuthRole(role);
              setAuthModalOpen(true);
            }}
          />
        ) : (
          /* Authenticated Module Views */
          <div className="animate-in fade-in duration-200">
            {activeModule === "dashboard" && (
              <>
                {currentUser.role === "AUTHORITY" && (
                  <AuthorityDashboard
                    city={selectedCity}
                    weather={weather}
                    airQuality={airQuality}
                    pressure={pressure}
                    incidents={incidents}
                    onNavigate={(mod) => handleSelectModule(mod)}
                  />
                )}
                {currentUser.role === "LOGISTICS_OPERATOR" && (
                  <LogisticsDashboard
                    city={selectedCity}
                    pressure={pressure}
                    weather={weather}
                    onNavigate={(mod) => handleSelectModule(mod)}
                  />
                )}
                {currentUser.role === "CITIZEN" && (
                  <CitizenDashboard
                    city={selectedCity}
                    weather={weather}
                    airQuality={airQuality}
                    incidents={incidents}
                    onNavigate={(mod) => handleSelectModule(mod)}
                  />
                )}
              </>
            )}

            {activeModule === "map" && (
              <MapModule
                city={selectedCity}
                infrastructure={infrastructure}
                incidents={incidents}
                activeRoute={activeRoute}
                vrpResult={vrpResult}
                onNavigateToRouting={() => handleSelectModule("routing")}
              />
            )}

            {activeModule === "routing" && (
              <RoutingModule
                city={selectedCity}
                initialTab={(activeSubTab as any) || "optimizer"}
                onSelectRoute={(rt) => setActiveRoute(rt)}
                onNavigateToMap={() => handleSelectModule("map")}
              />
            )}

            {activeModule === "logistics_vrp" && (
              <LogisticsOptimizerModule
                city={selectedCity}
                onOptimizeComplete={(res) => setVrpResult(res)}
                onNavigateToMap={() => handleSelectModule("map")}
              />
            )}

            {activeModule === "ai" && (
              <AIPredictionsModule
                city={selectedCity}
                weather={weather}
                airQuality={airQuality}
                pressure={pressure}
                incidents={incidents}
                initialSubTab={activeSubTab || "traffic"}
                onNavigateToRouting={(orig, dest) => handleSelectModule("routing")}
                onNavigateToMap={() => handleSelectModule("map")}
              />
            )}

            {activeModule === "traffic_ml" && <TrafficMLModule />}
            {activeModule === "demand_ml" && <DemandMLModule />}
            {activeModule === "pressure_index" && (
              <LogisticsPressureModule pressure={pressure} />
            )}
            {activeModule === "transit" && <TransitModule city={selectedCity} />}
            {activeModule === "parking_ev" && (
              <ParkingEVModule infrastructure={infrastructure} />
            )}

            {activeModule === "operations" && (
              <OperationsModule
                city={selectedCity}
                incidents={incidents}
                initialSubTab={activeSubTab || "incidents"}
                onIncidentUpdated={fetchIncidents}
                onNavigateToMap={() => handleSelectModule("map")}
              />
            )}

            {activeModule === "incidents" && (
              <IncidentModule
                city={selectedCity}
                incidents={incidents}
                onIncidentReported={fetchIncidents}
              />
            )}

            {activeModule === "command_center" && (
              <CommandCenterModule
                city={selectedCity}
                weather={weather}
                airQuality={airQuality}
                pressure={pressure}
                incidents={incidents}
                onNavigate={(mod) => handleSelectModule(mod)}
              />
            )}

            {activeModule === "ai_decision" && (
              <AIDecisionModule
                city={selectedCity}
                weather={weather}
                airQuality={airQuality}
                pressure={pressure}
                incidents={incidents}
              />
            )}

            {activeModule === "alerts" && <AlertsModule city={selectedCity} />}
            {activeModule === "data_quality" && <DataQualityModule />}
            {activeModule === "api_health" && <HealthModule />}
            {activeModule === "impact" && (
              <ImpactModule initialSubTab={(activeSubTab as any) || "impact"} cityId={selectedCity.id} />
            )}
          </div>
        )}
      </main>

      {/* Clean Light Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">CITYFLOW</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Urban Mobility & Logistics Operating System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Theme: Transportation & Logistics</span>
            <span>•</span>
            <span>Zero-Fabrication Architecture</span>
            {currentUser && (
              <>
                <span>•</span>
                <span className="font-semibold text-emerald-700">Role: {currentUser.role}</span>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Floating Groq AI Mobility Assistant Widget */}
      <AIChatbotWidget
        selectedCity={selectedCity}
        weather={weather}
        airQuality={airQuality}
        pressure={pressure}
        incidents={incidents}
        onOpenHelplines={() => setHelplineModalOpen(true)}
      />

      {/* Floating Quick Actions Panel */}
      {currentUser && (
        <QuickActions 
          onNavigate={(mod) => handleSelectModule(mod as ModuleId)} 
          currentModule={activeModule} 
        />
      )}

      {/* Welcome Onboarding Overlay */}
      {showOnboarding && currentUser && (
        <OnboardingOverlay
          userRole={currentUser.role}
          userName={currentUser.name}
          onDismiss={() => {
            setShowOnboarding(false);
            try {
              localStorage.setItem("cityflow_onboarding_seen", "true");
            } catch {}
          }}
        />
      )}
    </div>
  );
}
