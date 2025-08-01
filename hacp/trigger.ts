// 📦 app/api/hacp/trigger.ts — HACP Covenant Trigger Handler (Tier Sync + Webhook Ops)
import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { WebhookClient } from "discord.js"

const DISCORD_HACP_WEBHOOK = process.env.DISCORD_HACP_WEBHOOK || ""
const webhook = new WebhookClient({ url: DISCORD_HACP_WEBHOOK })

export async function POST(req: NextRequest) {
  const { userId, tier, action, data } = await req.json()

  if (!userId || !tier) {
    return NextResponse.json({ error: "Missing HACP payload" }, { status: 400 })
  }

  try {
    // 🎚️ Normalize Tier Logic
    const tierMap = {
      free: "🔓 Free Tier",
      pro: "⚡ Pro Access",
      founder: "👑 Founder Godmode",
      black: "🕊️ SaintTier Black Access"
    }
    const resolvedTier = tierMap[tier] || `🔧 Unknown Tier (${tier})`

    // 🧠 Store to KV (for escalation + fallback state)
    await kv.set(`user:${userId}:hacp`, { tier, action, timestamp: Date.now(), data })

    // 🔔 Fire Discord Alert
    await webhook.send({
      username: "SaintSal Covenant Monitor",
      avatarURL: "https://saintvisionai.com/logo.png",
      embeds: [
        {
          title: `🛎️ HACP Triggered for ${userId}`,
          description: `**Tier:** ${resolvedTier}\n**Action:** ${action || "—"}\n\nPayload received & stored.`,
          color: 0x9b59b6,
          footer: { text: "HACP System — SaintSal™ Protocol" },
          timestamp: new Date().toISOString()
        }
      ]
    })

    return NextResponse.json({
      status: "✅ HACP Trigger Logged",
      tier: resolvedTier,
      action: action || "none"
    })
  } catch (err) {
    console.error("❌ HACP trigger error:", err)
    return NextResponse.json({ error: "HACP trigger failed" }, { status: 500 })
  }
}
