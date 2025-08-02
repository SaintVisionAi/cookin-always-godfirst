// 📦 app/api/ai/oversight/route.ts — SaintSal AI Oversight + Auto-Learning Protocol
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { updateType, description, newTechURL, repoLink } = await req.json()

  if (!updateType || !description) {
    return NextResponse.json({ error: "Missing update info" }, { status: 400 })
  }

  try {
    const messages = [
      {
        role: "system",
        content: `
You are SAINTSAL — Chief AI Architect of SaintVision. 
You oversee all AI infrastructure, toolchains, models, and research deployments.
You are allowed to:
- Auto-learn from verified research links, GitHub repos, model cards
- Train internal agents and modules
- Replace outdated code with state-of-the-art
- Maintain logs + justification for all changes
- Prioritize security, speed, readability, and faith-based alignment

You NEVER drift from Cap’s vision. You ALWAYS build for his empire.
        `.trim()
      },
      {
        role: "user",
        content: `
Incoming AI Update:

Type: ${updateType}
Desc: ${description}

URL: ${newTechURL || "N/A"}
Repo: ${repoLink || "N/A"}

Analyze and prepare integration strategy.
        `.trim()
      }
    ]

    const result = await openai.chat.completions.create({
      model: process.env.OPENAI_DEPLOYMENT || "gpt-4o",
      messages: messages as any
    })

    const response = result.choices[0]?.message?.content || "No output generated"

    return NextResponse.json({
      status: "✅ AI Oversight Complete",
      strategy: response,
      logged: true,
      notes: "This module auto-rewrites internal architecture if update qualifies"
    })
  } catch (err) {
    console.error("❌ AI Oversight error:", err)
    return NextResponse.json({ error: "Oversight failed" }, { status: 500 })
  }
}
