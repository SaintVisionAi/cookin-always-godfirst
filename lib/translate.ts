
// lib/translate.ts
import { z } from "zod"

const schema = z.object({
  translations: z
    .array(
      z.object({
        detected_source_language: z.string(),
        text: z.string(),
      })
    )
    .nonempty(),
})

export async function translateText({
  text,
  targetLang,
}: {
  text: string
  targetLang: string
}): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY
  const url = process.env.DEEPL_API_URL || "https://api.deepl.com/v2/translate"

  if (!apiKey) {
    throw new Error("DeepL API key is missing in environment variables")
  }

  const params = new URLSearchParams({
    text,
    target_lang: targetLang.toUpperCase(),
  })

  const response = await fetch(`${url}?${params.toString()}`, {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  const json = await response.json()

  const parsed = schema.safeParse(json)

  if (!parsed.success) {
    console.error("DeepL response error", json)
    throw new Error("Failed to parse DeepL response")
  }

  return parsed.data.translations[0].text
}
