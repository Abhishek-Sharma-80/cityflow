# GREATER DELHI NCR DATA PROVENANCE & GEOGRAPHICAL CALIBRATION
**Platform:** CITYFLOW Urban Mobility & Logistics Operating System  
**Coverage Region:** National Capital Territory of Delhi (NCT) & NCR Satellite Nodes (Noida, Greater Noida, Gurugram, Faridabad, Ghaziabad)  
**Bounding Box:** Latitudes `[28.4000° N, 28.8800° N]`, Longitudes `[76.8400° E, 77.5000° E]`  

---

## 1. Ground Truth Corridors & Arterial Topography

All simulated and analyzed transportation corridors in CITYFLOW are mapped directly to physical ground-truth infrastructure across Delhi NCR (configured in `src/config/cityConfig.ts`):

```
+---------------------------------------------------------------------------------------------------------+
| CORRIDOR ID   | PHYSICAL HIGHWAY / ARTERIAL NAME        | DESIGN SPEED | LANES | PEAK BOTTLENECK POINT  |
+---------------+-----------------------------------------+--------------+-------+------------------------+
| ring_road     | Delhi Inner Ring Road (Mahatma Gandhi)  | 50 km/h      | 6-8   | AIIMS Flyover / Ashram |
| outer_ring    | Delhi Outer Ring Road                   | 60 km/h      | 6-8   | IIT Gate / Munirka     |
| dnd_flyway    | Delhi-Noida Direct (DND) Flyway         | 70 km/h      | 8     | Yamuna Toll Plaza      |
| nh48_gurgaon  | NH-48 Delhi-Gurgaon Expressway          | 65 km/h      | 8-10  | Sirhaul Border / IFFCO |
| meerut_exp    | Delhi-Meerut Expressway (NH-9)          | 80 km/h      | 14    | Ghazipur Border        |
| barapullah    | Barapullah Elevated Corridor            | 60 km/h      | 6     | Sarai Kale Khan Hub    |
| noida_exp     | Noida-Greater Noida Expressway          | 80 km/h      | 6     | Mahamaya Flyover       |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Public Transit Network Topology (DMRC Delhi Metro)

CITYFLOW integrates static GTFS line structures and interchange topologies for the Delhi Metro Rail Corporation:

```
+---------------------------------------------------------------------------------------+
| METRO LINE      | PRIMARY TERMINAL STATIONS               | INTERCHANGE STATIONS      |
+-----------------+-----------------------------------------+---------------------------+
| Yellow Line     | Samaypur Badli <-> Millennium City Gurugram | Kashmere Gate, Rajiv Chowk|
| Blue Line       | Dwarka Sector 21 <-> Noida Electronic City | Rajiv Chowk, Mandi House  |
| Violet Line     | Kashmere Gate <-> Raja Nahar Singh      | Central Secretariat       |
| Magenta Line    | Janakpuri West <-> Botanical Garden     | Hauz Khas, Kalkaji Mandir |
| Airport Express | New Delhi Railway Station <-> Yashobhoomi| Dhaula Kuan               |
+---------------------------------------------------------------------------------------+
```

---

## 3. Physical EV Charging & Logistics Hub Grounding

The system queries live OpenStreetMap Overpass QL nodes for municipal charging stations and delivery hubs across the NCT:
* **Connaught Place Central Hub:** `[28.6315° N, 77.2167° E]`
* **Okhla Industrial Area (Phases I-III):** `[28.5355° N, 77.2732° E]`
* **Gurugram Cyber City (DLF Phase 2/3):** `[28.4950° N, 77.0895° E]`
* **Noida Sector 62 / 63 IT & Logistics Belt:** `[28.6280° N, 77.3649° E]`
* **Kashmere Gate ISBT Inter-Modal Hub:** `[28.6675° N, 77.2285° E]`

---

## 4. Climatological & Environmental Sensor Grids

Live weather and particulate matter telemetry are spatially referenced against real-world continuous monitoring stations (CPCB & Copernicus):
- **Central Delhi Monitoring Grid:** Latitude `28.6139`, Longitude `77.2090` (Connaught Place / Mandir Marg)
- **South Delhi Monitoring Grid:** Latitude `28.5535`, Longitude `77.1945` (R.K. Puram / IIT Delhi)
- **East Delhi Monitoring Grid:** Latitude `28.6364`, Longitude `77.3005` (Anand Vihar ISBT)
