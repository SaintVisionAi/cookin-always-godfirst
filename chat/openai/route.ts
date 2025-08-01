import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()

  const {
    chatSettings,
    messages,
    functions,
    stream: enableStream = true // Set to false to disable streaming
  } = json as {
    chatSettings: {
      temperature: number
      model: string
    }
    messages: any[]
    functions?: any[]
    stream?: boolean
  }

  const payload: Record<string, any> = {
    messages,
    temperature: chatSettings.temperature,
    model: chatSettings.model,
    stream: enableStream,
  }

  // Vision support
  if (["gpt-4o", "gpt-4-vision-preview"].includes(chatSettings.model)) {
    payload.max_tokens = 4096
  }

  // Function/tool support
  if (functions && functions.length > 0) {
    payload.functions = functions
  }

  try {
    const url = `${process.env.OPENAI_ENDPOINT}openai/deployments/${process.env.OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.OPENAI_API_VERSION}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.OPENAI_API_KEY!,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return new Response(
        JSON.stringify({ message: errorData?.error?.message || "OpenAI error" }),
        { status: response.status }
      )
    }

    // STREAMING MODE
    if (enableStream && response.body) {
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      })
    }

    // STANDARD JSON
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error?.message || "Unknown server error",
      }),
      { status: 500 }
    )
  }
}
