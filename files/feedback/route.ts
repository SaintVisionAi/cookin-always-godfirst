// 📦 app/api/files/feedback/route.ts — Feedback Logger (Truth Tags + Judgment Overlay)
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { chunkId, feedbackType, notes, userId } = await req.json()

  if (!chunkId || !feedbackType) {
    return NextResponse.json({ error: "Missing feedback input" }, { status: 400 })
  }

  try {
    const { data, error } = await supabase.from("feedback_logs").insert([
      {
        chunk_id: chunkId,
        feedback_type: feedbackType, // e.g. "✅ Accurate", "⚠️ Needs Review", "❌ False", "🕊️ Spirit-Led"
        notes,
        submitted_by: userId || "system"
      }
    ])

    if (error) throw error

    return NextResponse.json({
      status: "✅ Feedback Logged",
      feedback: data
    })
  } catch (err) {
    console.error("❌ Feedback error:", err)
    return NextResponse.json({ error: "Failed to log feedback" }, { status: 500 })
  }
}
