// 📦 app/api/agent/feedback/route.ts — User Feedback Handler
import { NextRequest as FeedbackRequest, NextResponse as FeedbackResponse } from "next/server"
import { createNotionEntry } from "@/lib/actions/notion"

export async function POST(req: FeedbackRequest) {
  const { feedback } = await req.json()
  if (!feedback) return FeedbackResponse.json({ error: "Missing feedback" }, { status: 400 })

  try {
    const res = await createNotionEntry(process.env.NOTION_FEEDBACK_DB || "", feedback)
    return FeedbackResponse.json({ success: true, notion: res })
  } catch (err) {
    console.error("❌ Feedback log error:", err)
    return FeedbackResponse.json({ error: "Feedback log failed" }, { status: 500 })
  }
}
