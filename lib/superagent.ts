import { translateText, rephraseText } from "./deepl"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

type TranslateTarget = "ES" | "TL" | "ZH"

type SuperAgentOptions = {
  message: string
  taskType: "code" | "email" | "document" | "general"
  rewrite?: boolean
  translateTo?: TranslateTarget[]
}

export async function superAgent({
  message,
  taskType,
  rewrite = true,
  translateTo = [],
}: SuperAgentOptions) {
  // First, rephrase the message to improve clarity
  let polished = message
  if (rewrite) {
    try {
      polished = await rephraseText({ text: message })
    } catch (err) {
      console.warn("Rephrase failed, fallback to raw message:", err)
    }
  }

  // Build OpenAI prompt
  let prompt = ""
  switch (taskType) {
    case "code":
      prompt = `You are a senior engineer. Help write and fix code for this:\n\n"${polished}"`
      break
    case "email":
      prompt = `Write a professional email based on the following content:\n\n"${polished}"`
      break
    case "document":
      prompt = `Create a business-ready document (terms, policy, etc) based on:\n\n"${polished}"`
      break
    default:
      prompt = `Respond intelligently to:\n\n"${polished}"`
  }

  // Ask OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 2048,
  })

  const mainReply = completion.choices?.[0]?.message?.content || "Sorry, no output."

  // Translate results if needed
  const translations: Record<string, string> = {}
  for (const lang of translateTo) {
    try {
      translations[lang] = await translateText({ text: mainReply, targetLang: lang })
    } catch {
      translations[lang] = "[Translation failed]"
    }
  }

  return {
    originalInput: message,
    improved: polished,
    response: mainReply,
    translations,
  }
}
