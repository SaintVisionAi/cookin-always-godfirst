// 🗣️ SUPERSAL™ SPEECH & CHAT ENGINE
// Voice-powered AI that can SPEAK, LISTEN, and DOMINATE!

declare const process: {
  env: { [key: string]: string | undefined }
}

export interface SpeechConfig {
  azure: {
    speechKey: string
    speechRegion: string
    endpoint: string
  }
  assemblyAI: {
    apiKey: string
  }
  deepL: {
    apiKey: string
    apiUrl: string
  }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  audioUrl?: string
  language?: string
  metadata?: {
    speechToText?: boolean
    textToSpeech?: boolean
    translated?: boolean
    sentiment?: string
    confidence?: number
  }
}

export interface VoiceInteraction {
  sessionId: string
  messages: ChatMessage[]
  voiceEnabled: boolean
  language: string
  companion: 'supersal' | 'athena' | 'ebytech' | 'partnertech' | 'svtlegal'
  mode: 'companion' | 'client'
}

export class SuperSalSpeechEngine {
  private config: SpeechConfig

  constructor() {
    this.config = {
      azure: {
        speechKey: process.env.AZURE_SPEECH_KEY || process.env.AZURE_SPEECH_API_KEY || "",
        speechRegion: process.env.AZURE_SPEECH_REGION || "eastus",
        endpoint: process.env.AZURE_OPENAI_ENDPOINT || ""
      },
      assemblyAI: {
        apiKey: process.env.ASSEMBLYAI_API_KEY || ""
      },
      deepL: {
        apiKey: process.env.DEEPL_API_KEY || "",
        apiUrl: process.env.DEEPL_API_URL || "https://api.deepl.com/v2/translate"
      }
    }
  }

  /**
   * 🎤 SPEECH TO TEXT - Convert user voice to text
   */
  async speechToText(audioBlob: Blob, language: string = 'en'): Promise<{
    text: string
    confidence: number
    language: string
  }> {
    try {
      console.log("🎤 Converting speech to text...")

      // Use AssemblyAI for speech-to-text
      const formData = new FormData()
      formData.append('audio', audioBlob)

      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'authorization': this.config.assemblyAI.apiKey
        },
        body: formData
      })

      const { upload_url } = await uploadResponse.json()

      // Request transcription
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'authorization': this.config.assemblyAI.apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: upload_url,
          language_code: language === 'en' ? 'en_us' : language,
          sentiment_analysis: true,
          auto_highlights: true
        })
      })

      const transcript = await transcriptResponse.json()
      const transcriptId = transcript.id

      // Poll for completion
      let result
      do {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: { 'authorization': this.config.assemblyAI.apiKey }
        })
        result = await statusResponse.json()
      } while (result.status === 'processing' || result.status === 'queued')

      if (result.status === 'completed') {
        console.log("✅ Speech to text completed!")
        return {
          text: result.text || "",
          confidence: result.confidence || 0.95,
          language: language
        }
      } else {
        throw new Error(`Speech recognition failed: ${result.error}`)
      }

    } catch (error) {
      console.error("❌ Speech to text failed:", error)
      throw new Error(`Speech recognition failed: ${error}`)
    }
  }

  /**
   * 🗣️ TEXT TO SPEECH - Convert SuperSal's response to voice
   */
  async textToSpeech(text: string, options: {
    voice?: string
    language?: string
    speed?: number
    companion?: string
  } = {}): Promise<Blob> {
    try {
      console.log("🗣️ Converting text to speech...")

      // Choose voice based on companion
      let voiceName = "en-US-AriaNeural" // Default SuperSal voice
      
      if (options.companion === 'athena') {
        voiceName = "en-US-JennyNeural" // Professional healthcare voice
      } else if (options.companion === 'ebytech') {
        voiceName = "en-US-GuyNeural" // Confident business voice
      } else if (options.companion === 'svtlegal') {
        voiceName = "en-US-DavisNeural" // Authoritative legal voice
      }

      // Create SSML for better voice control
      const ssml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${options.language || 'en-US'}">
          <voice name="${voiceName}">
            <prosody rate="${options.speed || 1.0}" pitch="medium">
              ${text}
            </prosody>
          </voice>
        </speak>
      `

      // Call Azure Speech Service
      const response = await fetch(
        `https://${this.config.azure.speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': this.config.azure.speechKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
          },
          body: ssml
        }
      )

      if (!response.ok) {
        throw new Error(`Azure Speech API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      console.log("✅ Text to speech completed!")
      
      return audioBlob

    } catch (error) {
      console.error("❌ Text to speech failed:", error)
      throw new Error(`Text to speech failed: ${error}`)
    }
  }

  /**
   * 🌍 TRANSLATE TEXT - Multi-language support
   */
  async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'EN'): Promise<{
    translatedText: string
    detectedLanguage: string
    confidence: number
  }> {
    try {
      console.log(`🌍 Translating text to ${targetLanguage}...`)

      const response = await fetch(this.config.deepL.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.config.deepL.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          text: text,
          target_lang: targetLanguage.toUpperCase(),
          source_lang: sourceLanguage.toUpperCase()
        })
      })

      if (!response.ok) {
        throw new Error(`DeepL API error: ${response.status}`)
      }

      const result = await response.json()
      const translation = result.translations[0]

      console.log("✅ Translation completed!")
      
      return {
        translatedText: translation.text,
        detectedLanguage: translation.detected_source_language,
        confidence: 0.95 // DeepL doesn't provide confidence scores
      }

    } catch (error) {
      console.error("❌ Translation failed:", error)
      throw new Error(`Translation failed: ${error}`)
    }
  }

  /**
   * 🎯 ANALYZE SENTIMENT - Understand user emotion
   */
  analyzeSentiment(text: string): {
    sentiment: 'positive' | 'negative' | 'neutral'
    confidence: number
    emotion: string
  } {
    // Simple sentiment analysis (you can enhance this with Azure Text Analytics)
    const positiveWords = ['good', 'great', 'awesome', 'excellent', 'love', 'amazing', 'fantastic', 'wonderful']
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'stupid', 'frustrated']
    
    const textLower = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    let emotion = 'calm'
    let confidence = 0.5
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
      emotion = 'happy'
      confidence = Math.min(0.95, 0.5 + (positiveCount * 0.15))
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
      emotion = 'frustrated'
      confidence = Math.min(0.95, 0.5 + (negativeCount * 0.15))
    }
    
    // Check for urgency
    if (textLower.includes('urgent') || textLower.includes('asap') || textLower.includes('emergency')) {
      emotion = 'urgent'
      confidence = Math.max(confidence, 0.8)
    }
    
    return { sentiment, confidence, emotion }
  }

  /**
   * 🔊 CREATE VOICE INTERACTION - Full voice chat session
   */
  async createVoiceInteraction(options: {
    companion: string
    mode: string
    language: string
    voiceEnabled: boolean
  }): Promise<VoiceInteraction> {
    const sessionId = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const interaction: VoiceInteraction = {
      sessionId,
      messages: [],
      voiceEnabled: options.voiceEnabled,
      language: options.language,
      companion: options.companion as any,
      mode: options.mode as any
    }
    
    // Add welcome message
    const welcomeMessage = this.getWelcomeMessage(options.companion, options.mode)
    interaction.messages.push({
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date().toISOString(),
      metadata: {
        textToSpeech: options.voiceEnabled,
        sentiment: 'positive',
        confidence: 1.0
      }
    })
    
    console.log(`🎯 Created voice interaction session: ${sessionId}`)
    return interaction
  }

  /**
   * 💬 GET WELCOME MESSAGE - Companion-specific greetings
   */
  private getWelcomeMessage(companion: string, mode: string): string {
    const greetings = {
      supersal: {
        companion: "🔥 Yo! SuperSal here, your ultimate AI companion. What do you need help with today?",
        client: "👋 Hello! I'm SuperSal, your AI assistant. How can I help you achieve greatness today?"
      },
      athena: {
        companion: "🏥 Athena healthcare AI ready for medical operations and patient care coordination.",
        client: "👩‍⚕️ Hi! I'm Athena, your healthcare AI assistant. How can I help with your medical needs?"
      },
      ebytech: {
        companion: "💰 EbyTech financial systems online. Ready for lending operations and risk analysis.",
        client: "💼 Hello! I'm EbyTech, your financial AI assistant. Ready to help with your money matters!"
      },
      svtlegal: {
        companion: "⚖️ SVTLegal AI counsel activated. Legal research and document analysis ready.",
        client: "🏛️ Greetings! I'm SVTLegal, your legal AI assistant. How can I assist with legal matters?"
      },
      partnertech: {
        companion: "🤖 PartnerTech CRM systems active. Automation and client management ready.",
        client: "📊 Hi there! I'm PartnerTech, your CRM and automation assistant. Let's streamline your business!"
      }
    }
    
    return greetings[companion]?.[mode] || greetings.supersal.client
  }

  /**
   * 🎪 VALIDATE CONFIG - Check if all services are ready
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!this.config.azure.speechKey) {
      errors.push("Missing Azure Speech API key")
    }
    if (!this.config.assemblyAI.apiKey) {
      errors.push("Missing AssemblyAI API key")
    }
    if (!this.config.deepL.apiKey) {
      errors.push("Missing DeepL API key")
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// 🚀 SINGLETON INSTANCE
export const supersalSpeech = new SuperSalSpeechEngine()

export default supersalSpeech
