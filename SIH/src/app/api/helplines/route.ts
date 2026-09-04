import { NextRequest, NextResponse } from "next/server";
import { CITIES, DEFAULT_CITY_ID } from "@/config/cityConfig";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get("city") || DEFAULT_CITY_ID;
  const city = CITIES[cityId] || CITIES[DEFAULT_CITY_ID];

  const helplines = [
    {
      category: "Traffic & Road Hazards",
      name: `${city.name} Traffic Police 24x7 Control Room`,
      phone: "1095",
      altPhone: "011-25844444",
      purpose: "Live accident clearance, road blockage reporting, and traffic towing"
    },
    {
      category: "National Emergency",
      name: "National Emergency Response Support System (ERSS)",
      phone: "112",
      altPhone: "100",
      purpose: "Unified National Emergency Helpline (Police, Ambulance, Fire)"
    },
    {
      category: "Highway Emergency",
      name: "NHAI National Highway Emergency & Breakdown SOS",
      phone: "1033",
      altPhone: "1800-180-3333",
      purpose: "Expressway emergency assistance, vehicle recovery, and road patrol"
    },
    {
      category: "Monsoon & Disasters",
      name: `${city.name} State Disaster Management Authority (SDMA)`,
      phone: "1077",
      altPhone: "011-22421656",
      purpose: "Monsoon waterlogging, fallen trees, and infrastructure failures"
    },
    {
      category: "Public Metro Transit",
      name: `${city.transitAgency.split("/")[0].trim()} Control Room`,
      phone: "155370",
      altPhone: "011-22561231",
      purpose: "Metro route inquiries, station assistance, and transit disruptions"
    },
    {
      category: "Public Bus Transit",
      name: "Municipal Transport Bus Fleet Control Desk",
      phone: "1800-11-8181",
      altPhone: "011-23370238",
      purpose: "Bus routes, frequency status, and commuter breakdown assistance"
    },
    {
      category: "EV Infrastructure Support",
      name: `${city.name} EV Charging Grid & Fast DC Charger Support`,
      phone: "1800-209-5161",
      altPhone: "19122",
      purpose: "Public EV charger breakdown, charging bay access, and grid support"
    }
  ];

  return NextResponse.json({
    city: city.name,
    city_id: city.id,
    timestamp: new Date().toISOString(),
    total_helplines: helplines.length,
    helplines
  });
}
