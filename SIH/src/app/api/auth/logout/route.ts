import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent, verifyToken } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const verified = verifyToken(token);
      if (verified) {
        logAuditEvent(verified.userId, "User", verified.role, "LOGOUT", "User logged out of session", "SUCCESS");
      }
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: true });
  }
}