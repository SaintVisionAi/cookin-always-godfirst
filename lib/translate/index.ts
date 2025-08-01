import axios from "axios"

const DEEPL_API_URL = process.env.DEEPL_API_URL || "https://api.deepl.com/v2/translate"
const DEEPL_API_KEY = process.env.DEEPL_API_KEY

if (!DEEPL_API_KEY) throw new Error("❌ Missing DeepL API Key")

type TranslateOptions = {
  text: string
  targetLang: "ES" | "ZH" | "EN" | "TL" | string // Add more if needed
}

export async function translateText({ text, targetLang }: TranslateOptions): Promise<string> {
  try {
    const params = new URLSearchParams()
    params.append("auth_key", DEEPL_API_KEY)
    params.append("text", text)
    params.append("target_lang", targetLang.toUpperCase())

    const response = await axios.post(DEEPL_API_URL, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })

    return response.data.translations?.[0]?.text || text
  } catch (error: any) {
    console.error("❌ DeepL Error:", error.response?.data || error.message)
    return text // fallback to original
  }
}
