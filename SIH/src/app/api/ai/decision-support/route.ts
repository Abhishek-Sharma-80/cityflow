import { NextRequest, NextResponse } from "next/server";
import { askGeminiDecisionSupport } from "@/lib/gemini-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await askGeminiDecisionSupport(body);
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}