const DEEPL_API_URL = "https://api.deepl.com/v2"
const API_KEY = process.env.DEEPL_API_KEY

if (!API_KEY) {
  throw new Error("Missing DEEPL_API_KEY in environment variables")
}

async function deeplRequest(endpoint: string, body: object) {
  const response = await fetch(`${DEEPL_API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })

  const data = await response.json()

  if (!response.ok) {
    console.error("[DeepL API Error]", data)
    throw new Error(data.message || "DeepL API call failed")
  }

  return data
}

export async function translateText({
  text,
  targetLang
}: {
  text: string,
  targetLang: "ES" | "TL" | "ZH" | "EN"
}) {
  const res = await deeplRequest("/translate", {
    text: [text],
    target_lang: targetLang
  })

  return res.translations?.[0]?.text
}

export async function rephraseText({
  text,
  targetLang = "en-US"
}: {
  text: string,
  targetLang?: string
}) {
  const res = await deeplRequest("/write/rephrase", {
    text: [text],
    target_lang: targetLang
  })

  return res.improvements?.[0]?.text
}
