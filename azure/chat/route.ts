import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

interface SuperSalMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

interface SuperSalResponse {
  message: string
  confidence: number
  mood: 'excited' | 'helpful' | 'confident' | 'legendary'
  ready: boolean
  language?: string
  translation?: string
  emotions?: string[]
  intent?: string
  crm_data?: any
  payment_data?: any
}

interface SuperSalSession {
  id: string
  messages: SuperSalMessage[]
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Create SuperSal AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are SuperSal, the legendary AI assistant with 823 files of knowledge. 
                   You're confident, helpful, and have superman-level capabilities. 
                   Help users with their requests while maintaining your legendary status.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const salResponse: SuperSalResponse = {
      message: completion.choices[0]?.message?.content || 'SuperSal is processing...',
      confidence: 0.95,
      mood: 'confident',
      ready: true,
      intent: 'assist'
    }

    return NextResponse.json(salResponse)

  } catch (error) {
    console.error('SuperSal chat error:', error)
    return NextResponse.json(
      { error: 'SuperSal is temporarily unavailable' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'SuperSal AI is online',
    version: '1.0.0',
    capabilities: ['chat', 'knowledge-search', 'superman-mode'],
    ready: true
  })
}

// Export types for use in other files
export type { SuperSalMessage, SuperSalResponse, SuperSalSession }
