import { NextRequest } from 'next/server'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { plan = 'free', companion = false } = await req.json()

    const systemPrompt = `
You are SaintSal, onboarding guide for SaintVisionAI.
Your job is to welcome new users with a voice-narrated walkthrough.
Adapt tone and content based on:
- plan: ${plan}
- companion mode: ${companion}

Highlight features, AI tools, dashboards, and how to get the most from the system.
End with a divine tone: calm, encouraging, purpose-driven.
    `.trim()

    const prompt = 'Begin walkthrough.'

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o',
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    })

    const stream = OpenAIStream(res)
    return new StreamingTextResponse(stream)
  } catch (err) {
    console.error('Walkthrough error:', err)
    return new Response('Walkthrough failed.', { status: 500 })
  }
}
