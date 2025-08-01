import axios from "axios"

export async function notifyWebhook(payload: Record<string, any>) {
  const WEBHOOK_URL = process.env.AGENT_WEBHOOK_URL
  if (!WEBHOOK_URL) return

  try {
    await axios.post(WEBHOOK_URL, payload)
  } catch (err) {
    console.error("❌ Webhook failed", err)
  }
}
