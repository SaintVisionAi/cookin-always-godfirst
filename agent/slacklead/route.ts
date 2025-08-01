// 📦 app/api/agent/slacklead/route.ts — Slack Lead Handler
import { NextRequest as SlackRequest, NextResponse as SlackResponse } from "next/server"
import { logSlackLead } from "@/lib/actions/notion"

export async function POST(req: SlackRequest) {
  const { name, email, phone } = await req.json()
  if (!name) return SlackResponse.json({ error: "Missing name" }, { status: 400 })

  try {
    const notionRes = await logSlackLead(process.env.NOTION_LEADS_DB || "", { name, email, phone })
    return SlackResponse.json({ success: true, notion: notionRes })
  } catch (err) {
    console.error("❌ Slack lead error:", err)
    return SlackResponse.json({ error: "Slack lead log failed" }, { status: 500 })
  }
}
