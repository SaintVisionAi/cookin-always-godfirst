// 📦 app/api/files/index/route.ts — SaintSal File Indexer (Passive Learning Engine)
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { name, text, source } = await req.json()
  if (!text || !name) {
    return NextResponse.json({ error: "Missing file data" }, { status: 400 })
  }

  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1200,
      chunkOverlap: 100
    })
    const chunks = await splitter.createDocuments([text])

    const metadata = { fileName: name, source: source || "manual" }

    const vectorStore = await SupabaseVectorStore.fromDocuments(
      chunks,
      new OpenAIEmbeddings(),
      {
        client: supabase,
        tableName: "file_chunks",
        queryName: "match_file_chunks",
        metadata
      }
    )

    return NextResponse.json({ status: "✅ File Indexed", chunks: chunks.length })
  } catch (err) {
    console.error("❌ File indexing error:", err)
    return NextResponse.json({ error: "Indexing failed" }, { status: 500 })
  }
}
