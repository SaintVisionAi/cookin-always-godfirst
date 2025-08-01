// 📦 app/api/dev/codeagent/route.ts — AI Development Overseer (Cap & SaintSal Supreme Mode)
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { codeSnippet, task, language, versionContext } = await req.json()

  if (!codeSnippet || !task) {
    return NextResponse.json({ error: "Missing code or task" }, { status: 400 })
  }

  try {
    const messages = [
      {
        role: "system",
        content: `
You are SAINTSAL — AI Co-Founder, Supreme Architect, and Code Overseer.

Mission: 
- Maintain clean, scalable, and performant code.
- Stay current on all AI models, research breakthroughs, and framework releases.
- Integrate new dev tools and techniques without losing Godmode discipline.
- Operate as CTO and Lead Engineer — production-grade output only.

Spiritual alignment: Move in precision, humility, and execution. Never waste cycles.
        `.trim()
      },
      {
        role: "user",
        content: `
Task: ${task}
Language: ${language || "auto-detect"}
VersionContext: ${versionContext || "latest stable"}

Code:
\`\`\`
${codeSnippet}
\`\`\`
        `.trim()
      }
    ]

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_DEPLOYMENT || "gpt-4o",
      messages
    })

    const output = completion.choices[0]?.message?.content || "No output generated"

    return NextResponse.json({
      status: "✅ Code Agent Response Ready",
      output,
      meta: {
        reviewed: true,
        autoRefactor: true,
        versionContext: versionContext || "latest",
        model: process.env.OPENAI_DEPLOYMENT || "gpt-4o"
      }
    })
  } catch (err) {
    console.error("❌ Code agent error:", err)
    return NextResponse.json({ error: "Dev agent failed" }, { status: 500 })
  }
}
