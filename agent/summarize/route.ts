// 📦 app/api/agent/summarize/route.ts — Summarization Agent
import { NextRequest as SummarizeRequest, NextResponse as SummarizeResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: SummarizeRequest) {
  const { text } = await req.json()
  if (!text) return SummarizeResponse.json({ error: "Missing text" }, { status: 400 })

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [
        { role: "system", content: "Summarize the following text in concise bullet points." },
        { role: "user", content: text }
      ]
    })

    const summary = completion.choices[0]?.message?.content || "No summary generated"
    return SummarizeResponse.json({ summary })
  } catch (err) {
    console.error("❌ Summary error:", err)
    return SummarizeResponse.json({ error: "Summarization failed" }, { status: 500 })
  }
}
