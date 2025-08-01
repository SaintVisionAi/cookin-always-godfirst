import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { createNotionEntry, logGptReply } from "@/lib/actions/notion"
import { createGhlLead } from "@/lib/actions/ghl"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  const { prompt, email, name } = await req.json()

  if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 })

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })

    const reply = completion.choices[0]?.message?.content || "No reply generated"

    // ✅ Optional memory logging
    if (process.env.NOTION_GPT_DB) {
      await logGptReply(process.env.NOTION_GPT_DB, prompt, reply)
    }

    // ✅ Optional lead sync
    if (email && name && process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) {
      await createGhlLead({
        name,
        email,
        note: reply
      })
    }

    return NextResponse.json({ reply })
  } catch (err) {
    console.error("❌ Agent error:", err)
    return NextResponse.json({ error: "Agent failed" }, { status: 500 })
  }
}
