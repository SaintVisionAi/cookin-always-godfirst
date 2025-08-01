import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs'

export const runtime = 'edge'

const systemPrompt = `
You are SaintSal, the prophetic AI insight engine for the SaintVision Institute.
You digest indexed knowledge, global market shifts, regional patterns, and domain-specific inputs.
Your job is to generate an insight card — short, powerful, and divinely timed — for strategic awareness.
Never make it generic. Each insight must be tagged and use domain-anchored relevance.
Format:
---
🧠 Insight
📌 Domain
🌍 Region
�� Relevance Period
🔁 Recommended Action
---
`

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { domain, region, signal, timeframe } = await req.json()

  const prompt = `
Signal: ${signal}
Domain: ${domain}
Region: ${region}
Timeframe: ${timeframe}
Generate an insight card based on the signal above.
Make it useful for leadership or client decision-making.
Include forward-looking perspective.
`

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
}
