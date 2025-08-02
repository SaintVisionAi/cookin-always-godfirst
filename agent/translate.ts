import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang, notionDbId } = await req.json()

    const translated = await fetch("https://api.deepl.com/v2/translate", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        auth_key: process.env.DEEPL_API_KEY!,
        text,
        target_lang: targetLang
      })
    }).then(res => res.json())

    const content = translated?.translations?.[0]?.text || "Translation failed"

    // TODO: Log translation to Notion
    if (notionDbId) {
      console.log('Translation logged:', content)
    }

    return NextResponse.json({ translated: content })
  } catch (err) {
    console.error("❌ Translation error:", err)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
