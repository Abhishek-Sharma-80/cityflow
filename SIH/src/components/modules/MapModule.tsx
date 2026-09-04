"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CityGeography } from "@/config/cityConfig";
import { InfrastructurePoint, IncidentReport, RouteOption, VRPResult } from "@/types";
import { FleetVehicle } from "@/data/fleetData";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Layers,
  MapPin,
  Zap,
  AlertTriangle,
  Truck,
  Bus,
  CloudRain,
  Search,
  Check,
  X,
  Compass,
  Plus,
  Minus,
  RotateCcw,
  Navigation
} from "lucide-react";

// Dynamic import for Leaflet map component with SSR disabled
const DynamicLeafletMap = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-medium">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Initializing OpenStreetMap Vector Layer...</span>
      </div>
    </div>
  )
});

interface Props {
  city: CityGeography;
  infrastructure: InfrastructurePoint[];
  incidents: IncidentReport[];
  activeRoute?: RouteOption | null;
  vrpResult?: VRPResult | null;
  initialFilter?: string;
  onNavigateToRouting?: () => void;
}

// Greater Delhi NCR Regional Hubs & Key Corridors
const DELHI_NCR_HUBS = [
  { name: "Delhi (Central NCT)", lat: 28.6139, lng: 77.2090, zoom: 12 },
  { name: "Noida (Sector 18 / 62)", lat: 28.5708, lng: 77.3260, zoom: 13 },
  { name: "Greater Noida (Knowledge Park)", lat: 28.4744, lng: 77.5040, zoom: 13 },
  { name: "Ghaziabad (NH-24 Corridor)", lat: 28.6692, lng: 77.4538, zoom: 13 },
  { name: "Gurugram (Cyber City / IFFCO)", lat: 28.4595, lng: 77.0266, zoom: 13 },
  { name: "Faridabad (Industrial Belt)", lat: 28.4089, lng: 77.3178, zoom: 13 },
  { name: "Connaught Place (Central Hub)", lat: 28.6315, lng: 77.2167, zoom: 14 },
  { name: "South Extension Ring Road", lat: 28.5704, lng: 77.2210, zoom: 14 },
  { name: "Okhla Logistics Terminal", lat: 28.5355, lng: 77.2610, zoom: 14 }
];

export function MapModule({
  city,
  infrastructure,
  incidents,
  activeRoute,
  vrpResult,
  initialFilter,
  onNavigateToRouting
}: Props) {
  const [layers, setLayers] = useState({
    traffic: true,
    incidents: true,
    transit: true,
    weather: initialFilter === "weather" ? true : false,
    fleet: true,
    parking: true,
    evCharging: true,
    logistics: true
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>(city.center);
  const [mapZoom, setMapZoom] = useState<number>(city.zoom);

  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);

  // Dynamic Fleet Telemetry Fetching with Live Ingestion
  React.useEffect(() => {
    let isMounted = true;

    const fetchFleet = () => {
      fetch(`/api/fleet?city=${city.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.vehicles) {
            setFleetVehicles(data.vehicles);
          }
        })
        .catch(console.error);
    };

    fetchFleet();
    const interval = setInterval(fetchFleet, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [city.id]);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearchLocation = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) return;

    const lower = query.toLowerCase();
    const found = DELHI_NCR_HUBS.find((h) =>
      h.name.toLowerCase().includes(lower)
    );

    if (found) {
      setMapCenter([found.lat, found.lng]);
      setMapZoom(found.zoom);
    }
  };

  const handleResetView = () => {
    setMapCenter(city.center);
    setMapZoom(city.zoom);
    setSearchQuery("");
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <PageHeader 
        title="Live City Map" 
        description="Interactive city map with live traffic, incidents, EV stations & transit layers"
        icon={MapPin}
        breadcrumbs={[{ label: "Home" }, { label: "Map & Transit" }, { label: "Live City Map" }]}
      />

      {/* Map Control Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Metropolitan Spatial GIS & Mobility Console</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vector street network, real-time traffic flow, GTFS transit corridors, and active delivery fleet for {city.name}.
          </p>
        </div>

        {/* Search and Location Jump */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          {/* Location Search Input */}
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search location, corridor or hub..."
              value={searchQuery}
              onChange={(e) => handleSearchLocation(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Jump to Hub Dropdown */}
          <select
            onChange={(e) => {
              const idx = parseInt(e.target.value);
              if (!isNaN(idx) && DELHI_NCR_HUBS[idx]) {
                const hub = DELHI_NCR_HUBS[idx];
                setMapCenter([hub.lat, hub.lng]);
                setMapZoom(hub.zoom);
                setSearchQuery(hub.name);
              }
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Jump to Hub...</option>
            {DELHI_NCR_HUBS.map((hub, idx) => (
              <option key={idx} value={idx}>
                {hub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Layer Filter Toolbar & Map Controls */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center flex-wrap justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Layer Filters:</span>
          
          {/* Traffic Flow Filter */}
          <button
            onClick={() => toggleLayer("traffic")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-all ${
              layers.traffic
                ? "bg-rose-50 text-rose-800 border-rose-300 shadow-xs"
                : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${layers.traffic ? "bg-rose-500 animate-pulse" : "bg-slate-300"}`}></span>
            <span>Traffic Flow</span>
          </button>

          {/* Incidents Filter */}
          <button
            onClick={() => toggleLayer("incidents")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-all ${
              layers.incidents
                ? "bg-red-50 text-red-800 border-red-300 shadow-xs"
                : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Incidents ({incidents.length})</span>
          </button>

          {/* Transit & Metro Filter */}
          <button
            onClick={() => toggleLayer("transit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-all ${
              layers.transit
                ? "bg-purple-50 text-purple-800 border-purple-300 shadow-xs"
                : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Transit & Metro</span>
          </button>

          {/* Weather Radar Filter */}
          <button
            onClick={() => toggleLayer("weather")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-all ${
              layers.weather
                ? "bg-blue-50 text-blue-800 border-blue-300 shadow-xs"
                : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Weather Radar</span>
          </button>

          {/* Fleet Vehicles Filter */}
          <button
            onClick={() => toggleLayer("fleet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-all ${
              layers.fleet
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Fleet Vehicles ({fleetVehicles.length})</span>
          </button>
        </div>

        {/* View & Zoom Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setMapZoom((z) => Math.min(18, z + 1))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMapZoom((z) => Math.max(8, z - 1))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            title="Reset map to default Delhi NCR center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="h-[620px] w-full relative">
        <DynamicLeafletMap
          city={city}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          infrastructure={infrastructure}
          incidents={incidents}
          fleetVehicles={fleetVehicles}
          activeRoute={activeRoute}
          vrpResult={vrpResult}
          layers={layers}
          onSelectIncident={(inc) => setSelectedIncident(inc)}
          onSelectVehicle={(veh) => setSelectedVehicle(veh)}
        />
      </div>

      {/* Map Symbology Legend */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Active Map Layers & Symbology:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span>Active Fleet EV</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span>Delayed Fleet Unit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
            <span>DMRC Metro Station</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
            <span>Active Road Hazard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-700 inline-block"></span>
            <span>EV Charging Port</span>
          </div>
        </div>
      </div>

      {/* INCIDENT DETAILS DRAWER */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">{selectedIncident.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    selectedIncident.severity === "critical"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedIncident.severity}
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{selectedIncident.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedIncident.location_name}</span>
              </p>
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
              {selectedIncident.description}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Expected Delay</span>
                <strong className="text-slate-900 text-sm mt-0.5 block">18 mins delay</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">AI Recommendation</span>
                <strong className="text-emerald-800 text-xs mt-0.5 block">Use alternate corridor</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VEHICLE DETAILS DRAWER */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800">{selectedVehicle.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    selectedVehicle.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedVehicle.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{selectedVehicle.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assigned Driver: <strong>{selectedVehicle.driver}</strong> • {selectedVehicle.driverPhone}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Battery</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{selectedVehicle.battery_or_fuel_pct}%</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Speed</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{selectedVehicle.speed_kmh} km/h</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Capacity</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{selectedVehicle.capacity_utilization_pct}%</strong>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Transit Vector</span>
              <p className="font-semibold text-slate-800">{selectedVehicle.location_name} → {selectedVehicle.destination}</p>
            </div>

            {/* Official Emergency Helpline Bar */}
            <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Transit Control Helpline</span>
                <span className="font-bold text-emerald-950 text-xs">{selectedVehicle.emergencyHelplineLabel}</span>
              </div>
              <a
                href={`tel:${selectedVehicle.emergencyHelpline}`}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
              >
                <span>Call SOS ({selectedVehicle.emergencyHelpline})</span>
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}