import { NextRequest, NextResponse } from "next/server";
import { createDemoSession } from "@/lib/auth-service";
import { UserRole } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();
    const validRoles: UserRole[] = ["AUTHORITY", "LOGISTICS_OPERATOR", "CITIZEN"];
    const targetRole: UserRole = validRoles.includes(role) ? role : "AUTHORITY";

    const session = await createDemoSession(targetRole);
    return NextResponse.json({ session });
  } catch (err: any) {
    return NextResponse.json({ error: "Demo initialization error." }, { status: 500 });
  }
}