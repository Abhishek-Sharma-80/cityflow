import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const session = await authenticateUser(email, password);
    if (!session) {
      return NextResponse.json({ error: "Invalid credentials. Please check your email and password." }, { status: 401 });
    }

    return NextResponse.json({ session });
  } catch (err: any) {
    return NextResponse.json({ error: "Authentication system error occurred." }, { status: 500 });
  }
}