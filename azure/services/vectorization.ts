// 🧠 SUPERSAL™ VECTORIZATION ENGINE
// Knowledge Ingestion & Vector Search for TOTAL DOMINATION
import { AzureKeyCredential, OpenAIClient } from "@azure/openai"
import { createClient } from "@supabase/supabase-js"
import azureConfig from "../config"

export interface KnowledgeChunk {
  id: string
  content: string
  metadata: {
    source: string
    companion: 'supersal' | 'athena' | 'ebytech' | 'partnertech' | 'svtlegal'
    category: string
    tags: string[]
    confidence?: number
    timestamp: string
  }
  embedding?: number[]
}

export interface VectorSearchResult {
  chunks: KnowledgeChunk[]
  totalResults: number
  searchQuery: string
  companion?: string
}

export class SuperSalVectorEngine {
  private azureClient: OpenAIClient
  private supabase: any
  private config: any

  constructor() {
    this.config = azureConfig.getConfig()
    
    // Initialize Azure OpenAI Client
    this.azureClient = new OpenAIClient(
      this.config.openai.endpoint,
      new AzureKeyCredential(this.config.openai.apiKey)
    )

    // Initialize Supabase
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  /**
   * 🔥 VECTORIZE CONTENT - Convert text to embeddings
   */
  async vectorizeContent(content: string): Promise<number[]> {
    try {
      const embeddingRes = await this.azureClient.getEmbeddings(
        this.config.openai.deployments.embeddings || "text-embedding-ada-002",
        [content]
      )
      
      return embeddingRes.data[0].embedding
    } catch (error) {
      console.error("❌ Vectorization failed:", error)
      throw new Error(`Failed to vectorize content: ${error}`)
    }
  }

  /**
   * 🧠 INGEST KNOWLEDGE - Store vectorized content in Supabase
   */
  async ingestKnowledge(chunk: Omit<KnowledgeChunk, 'embedding'>): Promise<string> {
    try {
      // Generate embedding for the content
      const embedding = await this.vectorizeContent(chunk.content)
      
      // Store in Supabase with vector
      const { data, error } = await this.supabase
        .from('supersal_knowledge')
        .insert({
          id: chunk.id,
          content: chunk.content,
          metadata: chunk.metadata,
          embedding: embedding,
          created_at: new Date().toISOString()
        })
        .select()

      if (error) throw error

      console.log(`✅ Knowledge ingested: ${chunk.metadata.source} (${chunk.metadata.companion})`)
      return chunk.id
    } catch (error) {
      console.error("❌ Knowledge ingestion failed:", error)
      throw new Error(`Failed to ingest knowledge: ${error}`)
    }
  }

  /**
   * 🎯 SEARCH KNOWLEDGE - Vector similarity search
   */
  async searchKnowledge(
    query: string, 
    options: {
      companion?: string
      category?: string
      topK?: number
      threshold?: number
    } = {}
  ): Promise<VectorSearchResult> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.vectorizeContent(query)
      
      // Build search parameters
      const searchParams = {
        query_embedding: queryEmbedding,
        match_threshold: options.threshold || 0.78,
        match_count: options.topK || 5,
        companion_filter: options.companion || null,
        category_filter: options.category || null
      }

      // Execute vector search
      const { data: matches, error } = await this.supabase
        .rpc('supersal_vector_search', searchParams)

      if (error) throw error

      // Format results
      const chunks: KnowledgeChunk[] = matches.map((match: any) => ({
        id: match.id,
        content: match.content,
        metadata: {
          ...match.metadata,
          confidence: match.similarity
        },
        embedding: match.embedding
      }))

      return {
        chunks,
        totalResults: matches.length,
        searchQuery: query,
        companion: options.companion
      }
    } catch (error) {
      console.error("❌ Knowledge search failed:", error)
      throw new Error(`Failed to search knowledge: ${error}`)
    }
  }

  /**
   * 🔥 BATCH INGEST - Process multiple documents
   */
  async batchIngestDocuments(documents: {
    content: string
    source: string
    companion: string
    category: string
    tags: string[]
  }[]): Promise<string[]> {
    const results: string[] = []
    
    for (const doc of documents) {
      try {
        // Split document into chunks if too large
        const chunks = this.chunkDocument(doc.content, 1000)
        
        for (let i = 0; i < chunks.length; i++) {
          const chunkId = `${doc.source}_chunk_${i}_${Date.now()}`
          
          await this.ingestKnowledge({
            id: chunkId,
            content: chunks[i],
            metadata: {
              source: doc.source,
              companion: doc.companion as any,
              category: doc.category,
              tags: doc.tags,
              timestamp: new Date().toISOString()
            }
          })
          
          results.push(chunkId)
        }
      } catch (error) {
        console.error(`❌ Failed to ingest document: ${doc.source}`, error)
      }
    }
    
    return results
  }

  /**
   * 🧩 CHUNK DOCUMENT - Split large documents into manageable pieces
   */
  private chunkDocument(content: string, maxChunkSize: number = 1000): string[] {
    const sentences = content.split(/[.!?]+/)
    const chunks: string[] = []
    let currentChunk = ""

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxChunkSize) {
        currentChunk += sentence + ". "
      } else {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim())
        }
        currentChunk = sentence + ". "
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }

    return chunks.filter(chunk => chunk.length > 50) // Filter out tiny chunks
  }

  /**
   * 🎯 GROUNDED RESPONSE - Get context-aware response
   */
  async getGroundedResponse(
    query: string,
    companion: string = 'supersal'
  ): Promise<{
    response: string
    sources: KnowledgeChunk[]
    confidence: number
  }> {
    try {
      // Search for relevant knowledge
      const searchResults = await this.searchKnowledge(query, {
        companion,
        topK: 5,
        threshold: 0.75
      })

      // Build context from search results
      const context = searchResults.chunks
        .map(chunk => chunk.content)
        .join('\n\n')

      // Generate grounded prompt
      const groundedPrompt = `
You are SuperSal™, the ultimate AI assistant. Use the following context to answer the user's question.

CONTEXT:
${context}

USER QUESTION: ${query}

Provide a helpful, accurate response based on the context above. If the context doesn't contain relevant information, say so clearly.
`

      return {
        response: groundedPrompt,
        sources: searchResults.chunks,
        confidence: searchResults.chunks.length > 0 ? 
          searchResults.chunks.reduce((avg, chunk) => avg + (chunk.metadata.confidence || 0), 0) / searchResults.chunks.length 
          : 0
      }
    } catch (error) {
      console.error("❌ Grounded response failed:", error)
      throw new Error(`Failed to generate grounded response: ${error}`)
    }
  }

  /**
   * 📊 GET KNOWLEDGE STATS
   */
  async getKnowledgeStats(): Promise<{
    totalChunks: number
    companionBreakdown: Record<string, number>
    categoryBreakdown: Record<string, number>
  }> {
    try {
      const { data, error } = await this.supabase
        .from('supersal_knowledge')
        .select('metadata')

      if (error) throw error

      const companionBreakdown: Record<string, number> = {}
      const categoryBreakdown: Record<string, number> = {}

      data.forEach((item: any) => {
        const companion = item.metadata.companion
        const category = item.metadata.category

        companionBreakdown[companion] = (companionBreakdown[companion] || 0) + 1
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1
      })

      return {
        totalChunks: data.length,
        companionBreakdown,
        categoryBreakdown
      }
    } catch (error) {
      console.error("❌ Failed to get knowledge stats:", error)
      throw new Error(`Failed to get knowledge stats: ${error}`)
    }
  }
}

// Export singleton instance
export const supersalVector = new SuperSalVectorEngine()
export default supersalVector
