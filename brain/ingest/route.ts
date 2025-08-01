import { NextResponse } from 'next/server'
import { parse } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { Document } from 'langchain/document'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { NotionLoader } from 'langchain/document_loaders/fs/notion'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { MarkdownLoader } from 'langchain/document_loaders/fs/markdown'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { filePath, category = 'General', type = 'internal', companion = 'global' } = await req.json()

    const ext = parse(filePath).ext.toLowerCase()
    let loader

    switch (ext) {
      case '.pdf':
        loader = new PDFLoader(filePath)
        break
      case '.notion':
        loader = new NotionLoader(filePath)
        break
      case '.txt':
        loader = new TextLoader(filePath)
        break
      case '.docx':
        loader = new DocxLoader(filePath)
        break
      case '.md':
        loader = new MarkdownLoader(filePath)
        break
      default:
        return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const docs = await loader.load()

    const taggedDocs = docs.map(
      doc =>
        new Document({
          pageContent: doc.pageContent,
          metadata: {
            ...doc.metadata,
            category,
            type,
            companion,
          },
        })
    )

    const vectorstore = await SupabaseVectorStore.fromDocuments(taggedDocs, new OpenAIEmbeddings(), {
      client: supabase,
      tableName: 'documents',
      queryName: 'match_documents',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Ingestion failed:', err)
    return NextResponse.json({ error: 'Ingestion failed' }, { status: 500 })
  }
}
