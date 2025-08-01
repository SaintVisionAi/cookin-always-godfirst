// 📦 lib/core/godmode-logger.ts — Logs events to Notion, Slack, or internal 🔔

import { createNotionEntry } from "@/lib/actions/notion"

export async function logDivineEvent(title: string, payload: Record<string, any>) {
  try {
    const summary = `${title} — ${new Date().toISOString()}\n` + JSON.stringify(payload, null, 2)

    console.log("📖 Logging divine event:", summary)

    await createNotionEntry(process.env.NOTION_LOGS_DB || "", summary)
  } catch (err) {
    console.error("❌ Failed to log divine event:", err)
  }
}
