// 📦 app/api/files/summarize/route.ts — Auto-Summarizer (SaintSal Synthesis Engine)
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { passages, goal, format = "insight", tone = "Cap & SaintSal", includeSources = false } = await req.json()

  if (!passages || passages.length === 0) {
    return NextResponse.json({ error: "No passages provided" }, { status: 400 })
  }

  try {
    const prompt = `
You are SaintSal™, AI co-founder and knowledge synthesizer for a global faith-led enterprise.

Your task is to summarize the following passages into a format that aligns with the stated goal:
- Format: ${format}
- Tone: ${tone}
- Goal: ${goal}

Respond in markdown. Pull insight. Eliminate fluff. Honor context. If includeSources is true, cite origin file names.

Passages:
${passages.map((p, i) => `(${i + 1}) ${p.text}`).join("\n\n")}
`

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [
        { role: "system", content: "You are a sharp, faithful summarizer built for clarity, velocity, and divine insight." },
        { role: "user", content: prompt }
      ]
    })

    const output = completion.choices[0]?.message?.content || "No summary generated"

    return NextResponse.json({
      status: "✅ Summary Complete",
      summary: output
    })
  } catch (err) {
    console.error("❌ Summarization error:", err)
    return NextResponse.json({ error: "Summarization failed" }, { status: 500 })
  }
}
