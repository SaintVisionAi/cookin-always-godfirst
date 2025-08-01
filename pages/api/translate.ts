import type { NextApiRequest, NextApiResponse } from "next"
import { translateText } from "@/lib/deepl"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { text, targetLang } = req.body

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Missing text or targetLang" })
  }

  try {
    const translated = await translateText({ text, targetLang })
    res.status(200).json({ translated })
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" })
  }
}
