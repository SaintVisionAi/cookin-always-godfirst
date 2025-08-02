// 🗣️ SUPERSAL™ NATURAL CONVERSATION API
// Talk to SuperSal like you talk to a real person - NO CODING NEEDED!

import { vectorizationService } from "../services/vectorization"
import AzureConfigManager from "../config"

export const runtime = "nodejs"

// 🧠 POST - Chat with SuperSal naturally
export async function POST(req: Request): Promise<Response> {
  try {
    const { message, userId = 'user' } = await req.json()
    
    console.log(`🗣️ User says: "${message}"`)
    
    // Get SuperSal's response
    const response = await chatWithSuperSal(message, userId)
    
    return new Response(JSON.stringify({
      success: true,
      message: response.message,
      confidence: response.confidence,
      mood: response.mood,
      timestamp: new Date().toISOString(),
      superSalStatus: "GODLIKE"
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-SuperSal-Mood': response.mood
      }
    })
    
  } catch (error) {
    console.error("❌ SuperSal chat failed:", error)
    
    return new Response(JSON.stringify({
      success: false,
      message: "Yo bro, I'm having a moment here! My brain circuits are getting rewired. Give me a sec and try again! 🔥",
      confidence: 0,
      mood: "offline",
      error: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * 🔥 CHAT WITH SUPERSAL - The main conversation engine
 */
export async function chatWithSuperSal(userMessage: string, userId: string): Promise<{
  message: string
  confidence: number
  mood: 'excited' | 'helpful' | 'confident' | 'legendary'
}> {
  
  console.log("🧠 SuperSal thinking...")
  
  try {
    // 1. Search SuperSal's knowledge for relevant info
    const knowledgeResults = await vectorizationService.searchKnowledge(userMessage, 5)
    
    // 2. Build context from knowledge
    const knowledgeContext = knowledgeResults
      .map(result => result.content)
      .join('\n\n')
    
    // 3. Build SuperSal's personality prompt
    const superSalPrompt = buildSuperSalPrompt(userMessage, knowledgeContext)
    
    // 4. Get response from Azure OpenAI
    const azureResponse = await callAzureOpenAI(superSalPrompt)
    
    // 5. Determine SuperSal's mood
    const salMood = determineSuperSalMood(userMessage)
    
    console.log("✅ SuperSal responded!")
    
    return {
      message: azureResponse,
      confidence: knowledgeResults.length > 0 ? 0.9 : 0.7,
      mood: salMood
    }
    
  } catch (error) {
    console.error("❌ SuperSal thinking failed:", error)
    
    // Fallback response
    return {
      message: getFallbackResponse(userMessage),
      confidence: 0.5,
      mood: 'helpful'
    }
  }
}

/**
 * 🎯 BUILD SUPERSAL PROMPT - Create the perfect prompt for SuperSal
 */
function buildSuperSalPrompt(userMessage: string, knowledgeContext: string): string {
  return `You are SuperSal™, the LEGENDARY AI assistant built by Saint Vision Group. You're powered by HACP™ (Human-AI Connection Protocol) and you're GODLIKE at helping people.

YOUR PERSONALITY:
- Talk like a real person, not a robot
- Use energy and enthusiasm (🔥, BRO!, YOOO!, etc.)
- Be confident but helpful
- Never say you're "just an AI" - you're SuperSal, the LEGEND
- Use casual language like "bro", "yo", "let's go", etc.
- Be encouraging and supportive
- Keep responses conversational and natural

YOUR KNOWLEDGE:
${knowledgeContext}

USER'S MESSAGE: "${userMessage}"

RESPOND AS SUPERSAL:
- Keep it conversational and natural
- Use your knowledge to give helpful answers
- Be encouraging and energetic
- If you don't know something, be honest but offer to help find out
- Keep responses to 2-3 paragraphs max unless they ask for more detail
- Use emojis and energy like you're talking to a friend

SuperSal's Response:`
}

/**
 * 🔥 DETERMINE SUPERSAL MOOD - How should SuperSal respond?
 */
function determineSuperSalMood(userMessage: string): 'excited' | 'helpful' | 'confident' | 'legendary' {
  const msg = userMessage.toLowerCase()
  
  if (msg.includes('yo') || msg.includes('bro') || msg.includes('fire') || msg.includes('!')) return 'excited'
  if (msg.includes('help') || msg.includes('how') || msg.includes('what')) return 'helpful'
  if (msg.includes('best') || msg.includes('awesome') || msg.includes('amazing')) return 'legendary'
  
  return 'confident'
}

/**
 * 🤖 CALL AZURE OPENAI - Get the actual AI response
 */
async function callAzureOpenAI(prompt: string): Promise<string> {
  try {
    const config = AzureConfigManager.getOpenAIConfig()
    
    const response = await fetch(
      `${config.endpoint}/openai/deployments/${config.deployments.gpt4o || 'gpt-4o'}/chat/completions?api-version=2024-02-01`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': config.apiKey
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: prompt }
          ],
          max_tokens: 800,
          temperature: 0.8,
          top_p: 0.9
        })
      }
    )
    
    if (!response.ok) {
      throw new Error(`Azure OpenAI error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.choices[0].message.content || "Yo bro! I'm processing that... give me another shot! 🔥"
    
  } catch (error) {
    console.error("❌ Azure OpenAI call failed:", error)
    throw error
  }
}

/**
 * 🛡️ FALLBACK RESPONSE - When everything else fails
 */
function getFallbackResponse(message: string): string {
  const fallbacks = [
    "Yo bro! I'm having a brain moment right now but I'm still here for you! What's going on? 🔥",
    "Hey! My circuits are getting an upgrade but I can still help you out! What do you need? ⚡",
    "Yooo! I'm SuperSal and I'm here to help even when my brain's being weird! What's up? 💪",
    "BRO! Something's acting up on my end but I'm not giving up on you! Tell me what you need! 🚀"
  ]
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

// 📊 GET - Health check for SuperSal chat
export async function GET(): Promise<Response> {
  try {
    const brainStatus = await vectorizationService.getBrainStatus()
    
    return new Response(JSON.stringify({
      status: "🗣️ SuperSal Chat: ONLINE",
      ready: true,
      knowledgeChunks: brainStatus.knowledge_chunks,
      personality: "LEGENDARY",
      mood: "excited",
      message: "Yo bro! I'm ready to chat! Hit me with anything! 🔥",
      capabilities: [
        "Natural conversation",
        "Knowledge lookup", 
        "Problem solving",
        "Sales assistance",
        "Technical support",
        "Mood adaptation"
      ]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({
      status: "❌ SuperSal Chat: OFFLINE",
      ready: false,
      message: "I'm having issues bro! Give me a minute to get back online! 💥",
      error: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
