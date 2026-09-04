# DATA SOURCES CATALOG — CITYFLOW AI

CityFlow AI operates under a **Strict Zero-Fabrication Data Integrity Rule**. All telemetry and geospatial elements originate from verified public APIs and open data sources.

| Source Name | Provider | Data Type | Purpose | License | Update Frequency |
|---|---|---|---|---|---|
| **Open-Meteo Weather** | Open-Meteo (ECMWF/GFS) | REST API | Precipitation, temperature, wind speed for road friction adjustment | Open-Meteo Non-Commercial / CC-BY 4.0 | Real-time (15 min cache) |
| **Open-Meteo Air Quality** | Copernicus Atmosphere Service (CAMS) | REST API | PM2.5, PM10, NO2, CO dispersion telemetry | Open-Meteo Non-Commercial / CC-BY 4.0 | Real-time (1 hour cache) |
| **OSRM Routing Engine** | Project OSRM / OpenStreetMap | REST API | Multi-modal turn-by-turn routing, polyline geometry & travel time | ODbL / Open Source | Real-time on demand |
| **OpenStreetMap Overpass** | OpenStreetMap Foundation | Overpass QL | EV charging plazas and urban parking facilities | ODbL / Open Source | Real-time spatial query |
| **Nominatim Geocoding** | OpenStreetMap Foundation | REST API | Forward and reverse address geocoding | ODbL / Open Source | Real-time (1 hour cache) |
| **Public Transit (GTFS)** | DMRC / DTC & Municipal Transit | GTFS Static Feed | Route structures, headway timings, station indices | Open Transit Data | Scheduled revisions |
| **Spatial Incidents** | CityFlow Citizen Patrol & Police Store | Spatial Store | Active collisions, waterlogging, and roadwork bottlenecks | In-memory spatial store | Live crowd-sourced |