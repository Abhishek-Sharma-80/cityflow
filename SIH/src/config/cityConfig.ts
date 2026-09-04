export interface CityGeography {
  id: string;
  name: string;
  country: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  bbox: [number, number, number, number]; // [minLat, minLng, maxLat, maxLng]
  timezone: string;
  transitAgency: string;
  logisticsHubs: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    capacity: number;
  }[];
  sampleDeliveryStops: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    demand: number;
    priority: "high" | "medium" | "low";
  }[];
}

export const CITIES: Record<string, CityGeography> = {
  delhi: {
    id: "delhi",
    name: "Delhi NCR",
    country: "India",
    center: [28.6139, 77.2090],
    zoom: 12,
    bbox: [28.4041, 76.8425, 28.8835, 77.3486],
    timezone: "Asia/Kolkata",
    transitAgency: "Delhi Metro Rail Corporation (DMRC) / DTC",
    logisticsHubs: [
      { id: "del-hub-1", name: "Okhla Logistics Terminal", lat: 28.5355, lng: 77.2610, capacity: 500 },
      { id: "del-hub-2", name: "Kapashera Freight Hub", lat: 28.5200, lng: 77.0850, capacity: 450 },
      { id: "del-hub-3", name: "Patparganj Industrial Depot", lat: 28.6290, lng: 77.3090, capacity: 350 },
    ],
    sampleDeliveryStops: [
      { id: "s1", name: "Connaught Place Inner Circle", lat: 28.6304, lng: 77.2177, demand: 24, priority: "high" },
      { id: "s2", name: "Nehru Place Commercial Hub", lat: 28.5494, lng: 77.2528, demand: 18, priority: "medium" },
      { id: "s3", name: "Saket Select Citywalk", lat: 28.5285, lng: 77.2185, demand: 32, priority: "high" },
      { id: "s4", name: "Noida Sector 18 Market", lat: 28.5708, lng: 77.3260, demand: 20, priority: "low" },
      { id: "s5", name: "Lajpat Nagar Central Market", lat: 28.5700, lng: 77.2400, demand: 15, priority: "medium" },
      { id: "s6", name: "Vasant Kunj DLF Promenade", lat: 28.5380, lng: 77.1550, demand: 28, priority: "medium" },
      { id: "s7", name: "Dwarka Sector 10 District Centre", lat: 28.5815, lng: 77.0580, demand: 16, priority: "low" },
      { id: "s8", name: "Chandni Chowk Wholesale Hub", lat: 28.6560, lng: 77.2300, demand: 35, priority: "high" }
    ]
  },
  bengaluru: {
    id: "bengaluru",
    name: "Bengaluru",
    country: "India",
    center: [12.9716, 77.5946],
    zoom: 12,
    bbox: [12.8340, 77.4600, 13.1400, 77.7500],
    timezone: "Asia/Kolkata",
    transitAgency: "BMRCL (Namma Metro) & BMTC",
    logisticsHubs: [
      { id: "blr-hub-1", name: "Peenya Industrial Freight Depot", lat: 13.0300, lng: 77.5200, capacity: 600 },
      { id: "blr-hub-2", name: "Whitefield EPIP Logistics Centre", lat: 12.9780, lng: 77.7280, capacity: 400 },
    ],
    sampleDeliveryStops: [
      { id: "b1", name: "Indiranagar 100 Feet Road", lat: 12.9719, lng: 77.6412, demand: 22, priority: "high" },
      { id: "b2", name: "Koramangala 5th Block", lat: 12.9352, lng: 77.6245, demand: 30, priority: "high" },
      { id: "b3", name: "Electronic City Phase 1", lat: 12.8452, lng: 77.6602, demand: 25, priority: "medium" },
      { id: "b4", name: "MG Road Metro Complex", lat: 12.9756, lng: 77.6066, demand: 18, priority: "medium" },
      { id: "b5", name: "HSR Layout Sector 1", lat: 12.9121, lng: 77.6446, demand: 20, priority: "low" },
    ]
  },
  mumbai: {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    center: [19.0760, 72.8777],
    zoom: 12,
    bbox: [18.8900, 72.7700, 19.3000, 73.0200],
    timezone: "Asia/Kolkata",
    transitAgency: "MMRDA / BEST / Mumbai Suburban Rail",
    logisticsHubs: [
      { id: "mum-hub-1", name: "Bhiwandi Freight Hub", lat: 19.2967, lng: 73.0631, capacity: 800 },
      { id: "mum-hub-2", name: "BKC Logistics Depot", lat: 19.0660, lng: 72.8680, capacity: 300 },
    ],
    sampleDeliveryStops: [
      { id: "m1", name: "Bandra Kurla Complex", lat: 19.0667, lng: 72.8690, demand: 35, priority: "high" },
      { id: "m2", name: "Nariman Point Business Hub", lat: 18.9260, lng: 72.8230, demand: 28, priority: "high" },
      { id: "m3", name: "Andheri East MIDC", lat: 19.1197, lng: 72.8694, demand: 24, priority: "medium" },
      { id: "m4", name: "Powai Hiranandani", lat: 19.1176, lng: 72.9060, demand: 19, priority: "low" },
    ]
  },
  pune: {
    id: "pune",
    name: "Pune",
    country: "India",
    center: [18.5204, 73.8567],
    zoom: 12,
    bbox: [18.4100, 73.7400, 18.6600, 74.0000],
    timezone: "Asia/Kolkata",
    transitAgency: "PMPML & Pune Metro",
    logisticsHubs: [
      { id: "pun-hub-1", name: "Chakan Industrial Logistics Hub", lat: 18.7560, lng: 73.8580, capacity: 700 },
      { id: "pun-hub-2", name: "Hinjawadi IT Freight Depot", lat: 18.5910, lng: 73.7380, capacity: 350 },
    ],
    sampleDeliveryStops: [
      { id: "p1", name: "Hinjawadi Phase 1", lat: 18.5913, lng: 73.7389, demand: 28, priority: "high" },
      { id: "p2", name: "Koregaon Park North Main Rd", lat: 18.5362, lng: 73.8940, demand: 22, priority: "medium" },
      { id: "p3", name: "Shivajinagar Station Area", lat: 18.5308, lng: 73.8475, demand: 18, priority: "low" },
      { id: "p4", name: "Viman Nagar Town Centre", lat: 18.5679, lng: 73.9143, demand: 25, priority: "high" },
    ]
  }
};

export const DEFAULT_CITY_ID = "delhi";