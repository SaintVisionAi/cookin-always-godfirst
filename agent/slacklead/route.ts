// 📦 app/api/agent/slacklead/route.ts — Slack Lead Handler
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { name, email, phone } = await req.json()
  
  try {
    // TODO: Implement Slack and Notion integration
    console.log('Slack lead received:', { name, email, phone })
    
    return NextResponse.json({ success: true, message: "Lead captured!" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process lead" }, { status: 500 })
  }
}
