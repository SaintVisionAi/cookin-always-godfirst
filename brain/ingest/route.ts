import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileContent = await file.text()
    const { name: fileName } = parse(file.name)

    // Simple document processing
    const chunks = splitIntoChunks(fileContent, 1000)
    
    // Store in Supabase
    const results: any[] = []
    for (let i = 0; i < chunks.length; i++) {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          content: chunks[i],
          metadata: {
            fileName,
            chunkIndex: i,
            totalChunks: chunks.length,
            fileType: file.type,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to store chunk:', error)
        continue
      }

      results.push(data)
    }

    return NextResponse.json({
      message: `Successfully processed ${file.name}`,
      chunks: results.length,
      fileName
    })

  } catch (error) {
    console.error('File processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}

function splitIntoChunks(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = []
  let currentChunk = ''
  
  const sentences = text.split(/[.!?]+/)
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = ''
      }
    }
    currentChunk += sentence + '. '
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks
}
