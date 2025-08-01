// 📦 app/api/agent/translate/route.ts — Translate Prompt
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: NextRequest) {
  const { text, targetLang } = await req.json()
  if (!text || !targetLang) return NextResponse.json({ error: "Missing params" }, { status: 400 })

  try {
    const res = await axios.post(
      process.env.DEEPL_API_URL || "https://api.deepl.com/v2/translate",
      new URLSearchParams({
        text,
        target_lang: targetLang,
        auth_key: process.env.DEEPL_API_KEY || ""
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )

    const translated = res.data.translations[0]?.text
    return NextResponse.json({ translated })
  } catch (err) {
    console.error("❌ Translation error:", err)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
