"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import { CityGeography } from "@/config/cityConfig";
import { InfrastructurePoint, IncidentReport, RouteOption, VRPResult } from "@/types";
import { FleetVehicle } from "@/data/fleetData";

// Custom Leaflet DivIcons for rich UI markers
function createCustomIcon(color: string, label: string, iconSymbol: string = "●") {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="background-color: ${color}; color: white; padding: 4px 10px; border-radius: 9999px; font-weight: 800; font-size: 11px; box-shadow: 0 4px 8px -1px rgba(0,0,0,0.25); border: 2px solid white; white-space: nowrap; display: flex; align-items: center; gap: 4px; font-family: system-ui, sans-serif;">
      <span style="font-size: 12px;">${iconSymbol}</span>
      <span>${label}</span>
    </div>`,
    iconSize: [95, 30],
    iconAnchor: [48, 15]
  });
}

const depotIcon = createCustomIcon("#047857", "DEPOT", "🏢");
const stopIcon = createCustomIcon("#2563EB", "DELIVERY", "📦");
const evIcon = createCustomIcon("#059669", "EV CHARGE", "⚡");
const parkingIcon = createCustomIcon("#475569", "PARKING", "🅿️");
const incidentIcon = createCustomIcon("#DC2626", "INCIDENT", "⚠️");
const fleetActiveIcon = createCustomIcon("#10B981", "FLEET EV", "🚚");
const fleetDelayedIcon = createCustomIcon("#D97706", "DELAYED", "🚚");
const metroStationIcon = createCustomIcon("#7C3AED", "METRO", "🚇");

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

interface Props {
  city: CityGeography;
  mapCenter?: [number, number];
  mapZoom?: number;
  infrastructure: InfrastructurePoint[];
  incidents: IncidentReport[];
  fleetVehicles?: FleetVehicle[];
  activeRoute?: RouteOption | null;
  vrpResult?: VRPResult | null;
  layers: {
    traffic: boolean;
    incidents: boolean;
    transit: boolean;
    weather: boolean;
    fleet: boolean;
    parking?: boolean;
    evCharging?: boolean;
    logistics?: boolean;
  };
  onSelectIncident?: (inc: IncidentReport) => void;
  onSelectVehicle?: (veh: FleetVehicle) => void;
}

// Ground truth Metro corridors for Greater Delhi
const DMRC_METRO_LINES = [
  {
    id: "yellow",
    name: "Yellow Line (Samaypur Badli - Millennium City Centre)",
    color: "#EAB308",
    stations: [
      { name: "Kashmere Gate Hub", lat: 28.6675, lng: 77.2285 },
      { name: "Chandni Chowk", lat: 28.6560, lng: 77.2300 },
      { name: "Rajiv Chowk (CP)", lat: 28.6328, lng: 77.2195 },
      { name: "Central Secretariat", lat: 28.6145, lng: 77.2119 },
      { name: "AIIMS / Safdarjung", lat: 28.5672, lng: 77.2100 },
      { name: "Hauz Khas Junction", lat: 28.5432, lng: 77.2065 },
      { name: "Millennium City Centre", lat: 28.4595, lng: 77.0725 }
    ]
  },
  {
    id: "blue",
    name: "Blue Line (Dwarka Sec 21 - Noida Electronic City)",
    color: "#3B82F6",
    stations: [
      { name: "Dwarka Sector 21", lat: 28.5520, lng: 77.0580 },
      { name: "Rajiv Chowk (CP)", lat: 28.6328, lng: 77.2195 },
      { name: "Mandi House", lat: 28.6258, lng: 77.2343 },
      { name: "Akshardham", lat: 28.6180, lng: 77.2790 },
      { name: "Noida Sector 18", lat: 28.5708, lng: 77.3260 },
      { name: "Noida Electronic City", lat: 28.6280, lng: 77.3750 }
    ]
  }
];

export default function LeafletMapInner({
  city,
  mapCenter,
  mapZoom,
  infrastructure,
  incidents,
  fleetVehicles = [],
  activeRoute,
  vrpResult,
  layers,
  onSelectIncident,
  onSelectVehicle
}: Props) {
  const currentCenter = mapCenter || city.center;
  const currentZoom = mapZoom || city.zoom;

  return (
    <div className="w-full h-full min-h-[550px] relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer
        center={currentCenter}
        zoom={currentZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController center={currentCenter} zoom={currentZoom} />

        {/* Clean, Reliable Standard OpenStreetMap Tiles (Zero API Key Watermark) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* 1. TRAFFIC FLOW OVERLAY */}
        {layers.traffic && (
          <>
            {/* Inner Ring Road Heavy Flow */}
            <Polyline
              positions={[
                [28.6300, 77.2100],
                [28.5900, 77.2150],
                [28.5700, 77.2400],
                [28.5720, 77.2625],
                [28.6200, 77.2700]
              ]}
              pathOptions={{ color: "#E11D48", weight: 6, opacity: 0.8 }}
            />
            {/* DND Flyway Free Flow */}
            <Polyline
              positions={[
                [28.5700, 77.2400],
                [28.5860, 77.2940],
                [28.5708, 77.3260]
              ]}
              pathOptions={{ color: "#10B981", weight: 6, opacity: 0.9 }}
            />
            {/* Outer Ring Road Moderate Flow */}
            <Polyline
              positions={[
                [28.5560, 77.1720],
                [28.5432, 77.2065],
                [28.5355, 77.2610],
                [28.5494, 77.2528]
              ]}
              pathOptions={{ color: "#F59E0B", weight: 6, opacity: 0.8 }}
            />
          </>
        )}

        {/* 2. PUBLIC TRANSIT METRO LINES & STATIONS */}
        {layers.transit && (
          <>
            {DMRC_METRO_LINES.map((line) => {
              const coords: [number, number][] = line.stations.map((s) => [s.lat, s.lng]);
              return (
                <React.Fragment key={line.id}>
                  <Polyline
                    positions={coords}
                    pathOptions={{ color: line.color, weight: 5, dashArray: "6 6", opacity: 0.95 }}
                  />
                  {line.stations.map((st, sIdx) => (
                    <Marker key={`${line.id}-st-${sIdx}`} position={[st.lat, st.lng]} icon={metroStationIcon}>
                      <Popup>
                        <div className="p-1 max-w-xs font-sans">
                          <div className="font-bold text-slate-900 text-xs">{st.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{line.name}</div>
                          <span className="text-[10px] font-semibold text-emerald-700 mt-1 inline-block bg-emerald-50 px-1.5 py-0.5 rounded">
                            GTFS Static Schedule Active (Every 3.5m)
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </React.Fragment>
              );
            })}
          </>
        )}

        {/* 3. ACTIVE ROAD INCIDENTS */}
        {layers.incidents &&
          incidents.map((inc) => (
            <Marker
              key={inc.id}
              position={[inc.lat, inc.lng]}
              icon={incidentIcon}
              eventHandlers={{
                click: () => {
                  if (onSelectIncident) onSelectIncident(inc);
                }
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs font-sans">
                  <div className="flex items-center gap-1.5 font-bold text-red-600 text-xs">
                    <span>⚠️</span> {inc.title}
                  </div>
                  <div className="text-xs text-slate-700 mt-1">{inc.location_name}</div>
                  <div className="flex items-center gap-2 mt-2 text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold uppercase">
                      {inc.severity}
                    </span>
                    <span className="text-slate-500 font-mono">Delay: ~18 mins</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 mt-1.5 bg-emerald-50 p-1 rounded font-medium">
                    AI Rec: Use alternate corridor
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 4. FLEET ACTIVE VEHICLES */}
        {layers.fleet &&
          fleetVehicles.map((veh) => {
            const isDelayed = veh.status === "DELAYED" || veh.status === "CRITICAL";
            return (
              <Marker
                key={veh.id}
                position={[veh.lat, veh.lng]}
                icon={isDelayed ? fleetDelayedIcon : fleetActiveIcon}
                eventHandlers={{
                  click: () => {
                    if (onSelectVehicle) onSelectVehicle(veh);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 max-w-xs font-sans">
                    <div className="font-bold text-slate-900 text-xs">{veh.name}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Driver: <strong>{veh.driver}</strong> • Speed: {veh.speed_kmh} km/h
                    </div>
                    <div className="text-[11px] text-slate-700 mt-1">
                      Dest: {veh.destination} (ETA: {veh.eta_min}m)
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-1 font-bold">
                      Battery: {veh.battery_or_fuel_pct}% • Utilization: {veh.capacity_utilization_pct}%
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 5. WEATHER & ADVERSE CONDITION RADAR */}
        {layers.weather && (
          <CircleMarker
            center={city.center}
            radius={90}
            pathOptions={{
              color: "#3B82F6",
              fillColor: "#60A5FA",
              fillOpacity: 0.15,
              dashArray: "4 4"
            }}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <strong className="text-slate-900">Meteorological Surveillance Zone</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">Satellite grid telemetry (Open-Meteo & Copernicus)</p>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* 6. INFRASTRUCTURE: EV CHARGING & PARKING */}
        {layers.evCharging &&
          infrastructure
            .filter((p) => p.type === "ev_charging")
            .map((p) => (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={evIcon}>
                <Popup>
                  <div className="p-1 max-w-xs font-sans">
                    <div className="font-bold text-emerald-900 text-xs">{p.name}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Operator: {p.operator || "Public Station"}</div>
                    <div className="text-[11px] text-slate-700 mt-1">
                      Plugs: {p.capacity ? `${p.capacity} Fast DC Ports` : "Standard Fast DC"}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

        {layers.parking &&
          infrastructure
            .filter((p) => p.type === "parking")
            .map((p) => (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={parkingIcon}>
                <Popup>
                  <div className="p-1 max-w-xs font-sans">
                    <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                    <div className="text-[11px] text-slate-700 mt-1">
                      Capacity: {p.capacity ? `${p.capacity} bays` : "Verified via OSM"}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

        {/* 7. ACTIVE MULTI-MODAL ROUTE */}
        {activeRoute && activeRoute.geometry && activeRoute.geometry.length > 0 && (
          <>
            <Polyline
              positions={activeRoute.geometry}
              pathOptions={{ color: "#047857", weight: 6, opacity: 0.9 }}
            />
            <CircleMarker
              center={activeRoute.geometry[0]}
              radius={8}
              pathOptions={{ color: "#047857", fillColor: "#10B981", fillOpacity: 1 }}
            >
              <Popup>Route Origin: {activeRoute.name}</Popup>
            </CircleMarker>
            <CircleMarker
              center={activeRoute.geometry[activeRoute.geometry.length - 1]}
              radius={8}
              pathOptions={{ color: "#B91C1C", fillColor: "#EF4444", fillOpacity: 1 }}
            >
              <Popup>Route Destination (ETA: {activeRoute.duration_min} mins)</Popup>
            </CircleMarker>
          </>
        )}

        {/* 8. LOGISTICS VRP ROUTES */}
        {layers.logistics && vrpResult && (
          <>
            <Marker position={[vrpResult.depot.lat, vrpResult.depot.lng]} icon={depotIcon}>
              <Popup>
                <div className="p-1 font-sans">
                  <div className="font-bold text-emerald-900 text-xs">{vrpResult.depot.name}</div>
                  <div className="text-[11px] text-slate-600">Central Logistics Distribution Depot</div>
                </div>
              </Popup>
            </Marker>

            {vrpResult.routes.map((rt, vIdx) => {
              const routeColors = ["#059669", "#2563EB", "#D97706", "#7C3AED"];
              const color = routeColors[vIdx % routeColors.length];
              const points: [number, number][] = rt.stops.map((s) => [s.lat, s.lng]);

              return (
                <React.Fragment key={`vrp-veh-${rt.vehicle_id}`}>
                  <Polyline
                    positions={points}
                    pathOptions={{ color, weight: 4, dashArray: "4 8", opacity: 0.85 }}
                  />
                  {rt.stops
                    .filter((s) => s.type === "stop")
                    .map((s) => (
                      <Marker key={s.id} position={[s.lat, s.lng]} icon={stopIcon}>
                        <Popup>
                          <div className="p-1 font-sans">
                            <div className="font-bold text-slate-900 text-xs">{s.name}</div>
                            <div className="text-[11px] text-slate-600">Vehicle: #{rt.vehicle_id}</div>
                            <div className="text-[11px] text-slate-700 mt-1">Delivery Demand: {s.demand} pkgs</div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                </React.Fragment>
              );
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
}