// 📦 app/api/files/highlight/route.ts — Insight & Revelation Tagger (Breakthrough Moments)
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { fileId, userId, text, tag, sourcePage, relevanceScore } = await req.json()

  if (!fileId || !text || !tag) {
    return NextResponse.json({ error: "Missing highlight data" }, { status: 400 })
  }

  try {
    const { data, error } = await supabase.from("highlight_logs").insert([
      {
        file_id: fileId,
        user_id: userId || "anon",
        highlight_text: text,
        tag, // e.g. "🧬 Kingdom Principle", "⚡ Revelation", "🔍 Hidden Pattern", "🧠 Strategic Insight"
        source_page: sourcePage,
        relevance_score: relevanceScore || 1.0
      }
    ])

    if (error) throw error

    return NextResponse.json({
      status: "✅ Highlight Captured",
      highlight: data
    })
  } catch (err) {
    console.error("❌ Highlight logging error:", err)
    return NextResponse.json({ error: "Highlight logging failed" }, { status: 500 })
  }
}
