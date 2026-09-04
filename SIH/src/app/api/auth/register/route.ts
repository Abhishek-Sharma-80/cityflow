import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields (name, email, password, role) are required." }, { status: 400 });
    }

    const result = await registerUser(name, email, password, role);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ session: result });
  } catch (err: any) {
    return NextResponse.json({ error: "Registration service error." }, { status: 500 });
  }
}