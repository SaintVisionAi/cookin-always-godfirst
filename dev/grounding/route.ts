// 📦 app/api/dev/grounding/route.ts — Azure Search Grounding Engine (Supabase Vector Sync)
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { AzureKeyCredential, OpenAIClient } from "@azure/openai"

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

const azure = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT || "",
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY || "")
)

export async function POST(req: NextRequest) {
  const { query, namespace, topK } = await req.json()
  if (!query || !namespace) {
    return NextResponse.json({ error: "Missing query or namespace" }, { status: 400 })
  }

  try {
    const embeddingRes = await azure.getEmbeddings("text-embedding-ada-002", [query])
    const embedding = embeddingRes.data[0].embedding

    const { data: matches, error } = await supabase.rpc("match_vectors", {
      query_embedding: embedding,
      match_threshold: 0.78,
      match_count: topK || 5,
      namespace
    })

    if (error) throw error

    const sources = matches.map((m: any) => m.content)
    const groundedPrompt = `Use the following context to answer the user: \n\n${sources.join("\n\n")}\n\nQuery: ${query}`

    return NextResponse.json({
      status: "✅ Grounded with Supabase",
      groundedPrompt,
      contextCount: sources.length
    })
  } catch (err) {
    console.error("❌ Grounding error:", err)
    return NextResponse.json({ error: "Grounding failed" }, { status: 500 })
  }
}
