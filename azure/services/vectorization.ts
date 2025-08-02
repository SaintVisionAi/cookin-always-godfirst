// 🧠 SUPERSAL™ VECTORIZATION ENGINE
// Knowledge Ingestion & Vector Search for TOTAL DOMINATION
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

interface KnowledgeChunk {
  id: string
  content: string
  metadata: {
    fileName: string
    chunkIndex: number
    totalChunks: number
    fileType: string
    timestamp: string
  }
  vector?: number[]
}

interface SearchResult {
  content: string
  similarity: number
  metadata: any
}

/**
 * 🚀 SuperSal Vectorization Service
 * Handles knowledge embedding and retrieval for superhuman AI capabilities
 */
export class SuperSalVectorizationService {
  private openaiClient: OpenAI
  private supabaseClient: any

  constructor() {
    // Initialize OpenAI client
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    })

    // Initialize Supabase client
    this.supabaseClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  /**
   * 🎯 Generate embeddings for text content
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openaiClient.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
      })
      
      return response.data[0].embedding
    } catch (error) {
      console.error('🚨 Embedding generation failed:', error)
      throw error
    }
  }

  /**
   * 🚀 Index knowledge chunks with vectors
   */
  async indexKnowledge(chunks: KnowledgeChunk[]): Promise<void> {
    for (const chunk of chunks) {
      try {
        // Generate embedding
        const vector = await this.generateEmbedding(chunk.content)
        chunk.vector = vector

        // Store in Supabase
        await this.supabaseClient
          .from('supersal_knowledge')
          .insert({
            id: chunk.id,
            content: chunk.content,
            metadata: chunk.metadata,
            embedding: vector
          })

        console.log(`✅ Indexed chunk: ${chunk.id}`)
      } catch (error) {
        console.error(`❌ Failed to index chunk ${chunk.id}:`, error)
      }
    }
  }

  /**
   * 🔍 Search knowledge base using semantic similarity
   */
  async searchKnowledge(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      // Generate query embedding
      const queryVector = await this.generateEmbedding(query)

      // Perform similarity search in Supabase
      const { data, error } = await this.supabaseClient
        .rpc('match_documents', {
          query_embedding: queryVector,
          match_threshold: 0.7,
          match_count: limit
        })

      if (error) throw error

      return data.map((item: any) => ({
        content: item.content,
        similarity: item.similarity,
        metadata: item.metadata
      }))
    } catch (error) {
      console.error('🚨 Knowledge search failed:', error)
      return []
    }
  }

  /**
   * 🧠 Get SuperSal's brain status
   */
  async getBrainStatus() {
    try {
      const { count } = await this.supabaseClient
        .from('supersal_knowledge')
        .select('*', { count: 'exact', head: true })

      return {
        status: 'operational',
        knowledge_chunks: count || 0,
        last_updated: new Date().toISOString(),
        superman_mode: count > 1000 ? 'ACTIVATED' : 'READY'
      }
    } catch (error) {
      console.error('🚨 Brain status check failed:', error)
      return {
        status: 'error',
        knowledge_chunks: 0,
        last_updated: new Date().toISOString(),
        superman_mode: 'OFFLINE'
      }
    }
  }
}

// Export singleton instance
export const vectorizationService = new SuperSalVectorizationService()
