import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { query, filters = {}, topK = 6 } = await req.json()

    const vectorStore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(), {
      client: supabase,
      tableName: 'documents',
      queryName: 'match_documents',
    })

    const results = await vectorStore.similaritySearchWithScore(query, topK, filters)

    const formatted = results.map(([doc, score]) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
      score,
    }))

    return NextResponse.json({ results: formatted })
  } catch (err) {
    console.error('Query error:', err)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }
}
