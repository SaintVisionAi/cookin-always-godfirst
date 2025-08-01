// 🎤 app/api/transcribe/route.ts — AssemblyAI Voice Insight
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { logTranscription } from "@/lib/actions/notion"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const audioUrl = body.audioUrl

  if (!audioUrl) {
    return NextResponse.json({ error: "Missing audioUrl" }, { status: 400 })
  }

  try {
    const transcriptRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: audioUrl,
        auto_chapters: true,
        entity_detection: true,
        sentiment_analysis: true,
      },
      {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY!,
          "content-type": "application/json",
        },
      }
    )

    const transcriptId = transcriptRes.data.id

    // Poll until transcription is done
    let completed = false
    let result = null
    while (!completed) {
      const polling = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY!,
        },
      })

      if (polling.data.status === "completed") {
        result = polling.data
        completed = true
      } else if (polling.data.status === "error") {
        throw new Error(polling.data.error)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }

    // ✅ Optional: push to Notion
    if (process.env.NOTION_TRANSCRIPT_DB) {
      await logTranscription(process.env.NOTION_TRANSCRIPT_DB, result.text || "No transcript", audioUrl)
    }

    return NextResponse.json({ transcript: result })
  } catch (err) {
    console.error("❌ Transcription error:", err)
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
