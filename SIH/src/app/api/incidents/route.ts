import { NextRequest, NextResponse } from "next/server";
import { IncidentReport } from "@/types";

// In-memory spatial store initialized with realistic verified incident records
let incidentsStore: IncidentReport[] = [
  {
    id: "inc-101",
    category: "waterlogging",
    severity: "high",
    title: "Monsoon Waterlogging on Outer Ring Rd",
    description: "Waterlogging under South Extension flyover reducing traffic flow to single lane.",
    lat: 28.5704,
    lng: 77.2210,
    location_name: "South Extension Flyover, Ring Road",
    reported_by: "Traffic Control Room Delhi",
    reported_at: new Date(Date.now() - 42 * 60000).toISOString(),
    status: "verified",
    upvotes: 14,
    source: "AUTHORITY_SENSOR"
  },
  {
    id: "inc-102",
    category: "accident",
    severity: "critical",
    title: "Multi-vehicle collision near Ashram Chowk",
    description: "Two commercial trucks collided at intersection blocking 2 carriageway lanes.",
    lat: 28.5720,
    lng: 77.2625,
    location_name: "Ashram Chowk Intersection",
    reported_by: "Citizen Report (Verified by CCTV)",
    reported_at: new Date(Date.now() - 18 * 60000).toISOString(),
    status: "verified",
    upvotes: 29,
    source: "CITIZEN_APP"
  },
  {
    id: "inc-103",
    category: "signal_issue",
    severity: "medium",
    title: "Traffic Signal Stuck on Amber",
    description: "Signal controller malfunction causing queue buildup on arterial approach.",
    lat: 28.6250,
    lng: 77.2150,
    location_name: "Barakhamba Road Junction",
    reported_by: "Municipal Transit Patrol",
    reported_at: new Date(Date.now() - 55 * 60000).toISOString(),
    status: "under_review",
    upvotes: 6,
    source: "POLICE_CONTROL"
  },
  {
    id: "inc-104",
    category: "pothole",
    severity: "low",
    title: "Severe Pothole Cluster on Service Lane",
    description: "Damaged road surface slowing two-wheeler transit.",
    lat: 28.5350,
    lng: 77.2600,
    location_name: "Okhla Industrial Area Phase III",
    reported_by: "Delivery Rider Network",
    reported_at: new Date(Date.now() - 120 * 60000).toISOString(),
    status: "reported",
    upvotes: 11,
    source: "CITIZEN_APP"
  }
];

export async function GET() {
  return NextResponse.json({ incidents: incidentsStore });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newInc: IncidentReport = {
      id: `inc-${Date.now()}`,
      category: body.category || "congestion",
      severity: body.severity || "medium",
      title: body.title,
      description: body.description,
      lat: body.lat,
      lng: body.lng,
      location_name: body.location_name || "Reported Location",
      reported_by: body.reported_by || "Citizen Contributor",
      reported_at: new Date().toISOString(),
      status: "reported",
      upvotes: 1,
      source: "CITIZEN_APP"
    };
    incidentsStore.unshift(newInc);
    return NextResponse.json({ success: true, incident: newInc });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, upvote } = body;
    const item = incidentsStore.find(i => i.id === id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (status) item.status = status;
    if (upvote) item.upvotes += 1;
    return NextResponse.json({ success: true, incident: item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}