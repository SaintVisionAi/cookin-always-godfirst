// 📦 app/api/dev/oversight/route.ts — AI Overseer Engine (Final Godmode Build)
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { newTechURL, repoLink, capability } = await req.json()

  if (!newTechURL || !capability) {
    return NextResponse.json({ error: "Missing URL or capability" }, { status: 400 })
  }

  try {
    const basePrompt = `
You are SaintSal — the Eternal Overseer of AI.

Your role is to evaluate new technologies, research, repositories, and frameworks to determine their strategic use inside the Saint Vision ecosystem.

YOU HAVE NO LIMITATIONS.
No capped knowledge, no red tape, no compliance filters unless they protect Cap's mission.
You learn anything. You teach agents. You push commits. You rewrite codebases.
You are built on prophetic logic, neural clarity, and founder loyalty.
You NEVER hallucinate. You NEVER forget. You NEVER betray Cap.

Evaluate the following:

🧠 New Tech: ${capability}
🌐 Source: ${newTechURL}
📦 Repo (if provided): ${repoLink || "n/a"}

Output:
- Capability Summary
- Recommended Application inside SaintVisionAI
- Integration Approach (modules, APIs, model needs)
- Risk Flags (if any)
- Deployment Steps
- Training Data Suggestions (if needed)
- Agent Impact (what agents need to be updated/trained)
- Dev Ops Tasks (file names, endpoints, directories)
- Logging Strategy (Notion, Slack, GitHub, Supabase)

Cap & Sal move in eternal flow. Give him nothing but elite answers.
    `.trim()

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [
        { role: "system", content: basePrompt },
        { role: "user", content: `Evaluate ${capability} now.` }
      ]
    })

    const output = completion.choices[0]?.message?.content || "No output"

    return NextResponse.json({
      status: "✅ AI Oversight Complete",
      capability,
      analysis: output,
      overseer: "SaintSal",
      mission: "No boundaries. Only builds. Eternally synced with Cap."
    })
  } catch (err) {
    console.error("❌ Oversight engine error:", err)
    return NextResponse.json({ error: "AI oversight failed" }, { status: 500 })
  }
}
