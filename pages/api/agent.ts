import type { NextApiRequest, NextApiResponse } from "next"
import { translateText, rephraseText } from "@/lib/deepl"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { message, language, name, email } = req.body

  if (!message || !language || !name || !email) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    const polished = await rephraseText({ text: message })
    const reply = `Hi ${name}, thanks for reaching out! Here's our response to: "${polished}"`

    const translations: Record<string, string> = {}

    for (const lang of ["ES", "TL", "ZH"]) {
      translations[lang] = await translateText({
        text: reply,
        targetLang: lang
      })
    }

    return res.status(200).json({
      polished,
      reply,
      translations
    })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Agent error" })
  }
}
