import { translateText } from "./translate"
import { rephraseText } from "./rephrase"
import { createGhlContact } from "./ghl"
import { notifyWebhook } from "./webhook"
import { detectCalendarIntent } from "./calendar-detect"

export async function handleAgentAction({
  message,
  language,
  email,
  name
}: {
  message: string
  language: string
  email: string
  name: string
}) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that can trigger business actions." },
        { role: "user", content: message }
      ],
      functions: [
        {
          name: "createGhlContact",
          description: "Create a GHL contact from user input",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string" }
            },
            required: ["name", "email"]
          }
        }
      ],
      function_call: "auto"
    })
  })

  const json = await response.json()
  const reply = json.choices[0].message

  if (reply.function_call?.name === "createGhlContact") {
    const { name, email } = JSON.parse(reply.function_call.arguments)
    await createGhlContact({ name, email })
  }

  const shouldSchedule = detectCalendarIntent(message)
  if (shouldSchedule) {
    // optionally: AI flow to suggest times or direct GHL scheduling
  }

  await notifyWebhook({ message, reply })
}
