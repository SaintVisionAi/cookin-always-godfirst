import { translateText, rephraseText } from "@/lib/deepl"

async function runExamples() {
  const original = "Hello, how are you?"

  const spanish = await translateText({ text: original, targetLang: "ES" })
  const tagalog = await translateText({ text: original, targetLang: "TL" })
  const chinese = await translateText({ text: original, targetLang: "ZH" })

  const fixed = await rephraseText({
    text: "I could relly use sum help with edits on thiss text !"
  })

  console.log("🇪🇸 Spanish:", spanish)
  console.log("🇵🇭 Tagalog:", tagalog)
  console.log("🇨🇳 Chinese:", chinese)
  console.log("📝 Rephrased:", fixed)
}

runExamples()
