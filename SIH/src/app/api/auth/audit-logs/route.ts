import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs, verifyToken } from "@/lib/auth-service";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized access to audit logs." }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const verified = verifyToken(token);
  if (!verified || verified.role !== "AUTHORITY") {
    return NextResponse.json({ error: "Access denied. Authority privileges required to inspect system audit logs." }, { status: 403 });
  }

  return NextResponse.json({ logs: getAuditLogs() });
}