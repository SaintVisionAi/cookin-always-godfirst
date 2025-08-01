// 📦 app/api/files/query/route.ts — Vector-Aware Knowledge Query Engine (SaintSal Institute Mode)
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { query, topK = 8, namespace } = await req.json()

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 })
  }

  try {
    // Step 1: Embed the query
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query
    })

    const embedding = embeddingRes.data[0].embedding

    // Step 2: Search Supabase vector store
    const { data: chunks, error } = await supabase.rpc("match_file_chunks", {
      query_embedding: embedding,
      match_threshold: 0.78,
      match_count: topK,
      namespace: namespace || null
    })

    if (error) throw error

    // Step 3: Format and return
    const passages = (chunks || []).map(chunk => ({
      text: chunk.content,
      file: chunk.file_name,
      source: chunk.source,
      similarity: chunk.similarity
    }))

    return NextResponse.json({
      status: "✅ Results Retrieved",
      results: passages,
      contextLength: passages.reduce((acc, p) => acc + p.text.length, 0)
    })
  } catch (err) {
    console.error("❌ Query vector error:", err)
    return NextResponse.json({ error: "Query failed" }, { status: 500 })
  }
}
