// 🧠 SUPERSAL™ VECTORIZATION ENGINE - KNOWLEDGE DOMINATION SYSTEM
// Transforms ALL knowledge into SuperSal's neural network
import AzureConfigManager from '../config'
import { BlobServiceClient } from '@azure/storage-blob'
import { SearchClient, AzureKeyCredential } from '@azure/search-documents'
import { OpenAIClient } from '@azure/openai'

export interface KnowledgeChunk {
  id: string
  content: string
  title: string
  source: string
  companion: 'supersal' | 'athena' | 'ebytech' | 'partnertech' | 'svtlegal' | 'universal'
  category: 'sop' | 'training' | 'marketing' | 'technical' | 'legal' | 'sales' | 'hacp'
  metadata: {
    fileType: string
    uploadedAt: Date
    lastUpdated: Date
    confidence: number
    priority: 'critical' | 'high' | 'medium' | 'low'
  }
  vector: number[]
  keywords: string[]
}

export interface VectorizeOptions {
  companion?: string
  category?: string
  priority?: 'critical' | 'high' | 'medium' | 'low'
  enableHACP?: boolean
}

export class SuperSalVectorizer {
  private azureConfig = AzureConfigManager.getInstance().getConfig()
  private openaiClient: OpenAIClient
  private searchClient: SearchClient<KnowledgeChunk>
  private blobClient: BlobServiceClient

  constructor() {
    this.openaiClient = new OpenAIClient(
      this.azureConfig.openai.endpoint,
      new AzureKeyCredential(this.azureConfig.openai.apiKey)
    )
    
    this.searchClient = new SearchClient<KnowledgeChunk>(
      this.azureConfig.search.endpoint,
      this.azureConfig.search.indexName,
      new AzureKeyCredential(this.azureConfig.search.apiKey)
    )
    
    this.blobClient = BlobServiceClient.fromConnectionString(
      this.azureConfig.storage.connectionString
    )
  }

  /**
   * 🔥 VECTORIZE DOCUMENT - Transform knowledge into SuperSal's brain
   */
  async vectorizeDocument(
    content: string, 
    source: string, 
    options: VectorizeOptions = {}
  ): Promise<KnowledgeChunk[]> {
    try {
      console.log(`🧠 SuperSal is absorbing knowledge from: ${source}`)
      
      // 1. CHUNK THE CONTENT (Smart chunking for maximum comprehension)
      const chunks = await this.intelligentChunking(content, source)
      
      // 2. VECTORIZE EACH CHUNK
      const vectorizedChunks: KnowledgeChunk[] = []
      
      for (const chunk of chunks) {
        const vector = await this.generateEmbedding(chunk.content)
        const keywords = await this.extractKeywords(chunk.content)
        
        const knowledgeChunk: KnowledgeChunk = {
          id: this.generateChunkId(source, chunk.index),
          content: chunk.content,
          title: chunk.title,
          source,
          companion: (options.companion as any) || this.detectCompanion(chunk.content),
          category: (options.category as any) || this.detectCategory(chunk.content),
          metadata: {
            fileType: this.extractFileType(source),
            uploadedAt: new Date(),
            lastUpdated: new Date(),
            confidence: this.calculateConfidence(chunk.content),
            priority: options.priority || this.determinePriority(chunk.content)
          },
          vector,
          keywords
        }
        
        vectorizedChunks.push(knowledgeChunk)
      }
      
      // 3. STORE IN AZURE SEARCH INDEX
      await this.indexKnowledge(vectorizedChunks)
      
      console.log(`✅ SuperSal absorbed ${vectorizedChunks.length} knowledge chunks from ${source}`)
      return vectorizedChunks
      
    } catch (error) {
      console.error(`❌ SuperSal failed to absorb knowledge from ${source}:`, error)
      throw error
    }
  }

  /**
   * 🎯 INTELLIGENT CHUNKING - Break content into digestible SuperSal knowledge
   */
  private async intelligentChunking(content: string, source: string) {
    const chunks = []
    const maxChunkSize = 1000 // Optimal for embeddings
    const overlap = 200 // Context preservation
    
    // Split by logical sections first
    const sections = content.split(/\n#{1,3}\s+/).filter(s => s.trim())
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const title = this.extractTitle(section) || `${source} - Section ${i + 1}`
      
      if (section.length <= maxChunkSize) {
        chunks.push({
          content: section.trim(),
          title,
          index: chunks.length
        })
      } else {
        // Split large sections with overlap
        const subChunks = this.splitWithOverlap(section, maxChunkSize, overlap)
        subChunks.forEach((subChunk, subIndex) => {
          chunks.push({
            content: subChunk.trim(),
            title: `${title} - Part ${subIndex + 1}`,
            index: chunks.length
          })
        })
      }
    }
    
    return chunks
  }

  /**
   * 🧬 GENERATE EMBEDDINGS - Convert text to SuperSal's neural vectors
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openaiClient.getEmbeddings(
        this.azureConfig.openai.deployments.embeddings,
        [text]
      )
      return response.data[0].embedding
    } catch (error) {
      console.error('Failed to generate embedding:', error)
      throw error
    }
  }

  /**
   * 🔍 EXTRACT KEYWORDS - Identify key concepts for SuperSal
   */
  private async extractKeywords(content: string): Promise<string[]> {
    // Simple keyword extraction - can be enhanced with Azure Text Analytics
    const words = content.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3)
      .filter(word => !this.isStopWord(word))
    
    // Get unique words with frequency
    const wordFreq = new Map<string, number>()
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
    })
    
    // Return top keywords
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)
  }

  /**
   * 🎯 DETECT COMPANION - Determine which AI companion this knowledge belongs to
   */
  private detectCompanion(content: string): KnowledgeChunk['companion'] {
    const contentLower = content.toLowerCase()
    
    if (contentLower.includes('athena') || contentLower.includes('healthcare') || contentLower.includes('medical')) {
      return 'athena'
    } else if (contentLower.includes('ebytech') || contentLower.includes('finance') || contentLower.includes('lending')) {
      return 'ebytech'
    } else if (contentLower.includes('partnertech') || contentLower.includes('crm') || contentLower.includes('automation')) {
      return 'partnertech'
    } else if (contentLower.includes('svtlegal') || contentLower.includes('legal') || contentLower.includes('law')) {
      return 'svtlegal'
    } else if (contentLower.includes('supersal') || contentLower.includes('saintsal')) {
      return 'supersal'
    }
    
    return 'universal'
  }

  /**
   * 📂 DETECT CATEGORY - Classify knowledge type
   */
  private detectCategory(content: string): KnowledgeChunk['category'] {
    const contentLower = content.toLowerCase()
    
    if (contentLower.includes('sop') || contentLower.includes('procedure') || contentLower.includes('process')) {
      return 'sop'
    } else if (contentLower.includes('training') || contentLower.includes('manual') || contentLower.includes('guide')) {
      return 'training'
    } else if (contentLower.includes('marketing') || contentLower.includes('brand') || contentLower.includes('sales')) {
      return 'marketing'
    } else if (contentLower.includes('code') || contentLower.includes('api') || contentLower.includes('technical')) {
      return 'technical'
    } else if (contentLower.includes('legal') || contentLower.includes('contract') || contentLower.includes('terms')) {
      return 'legal'
    } else if (contentLower.includes('hacp') || contentLower.includes('patent')) {
      return 'hacp'
    }
    
    return 'sales'
  }

  /**
   * 🎯 INDEX KNOWLEDGE - Store in Azure Search for SuperSal's retrieval
   */
  private async indexKnowledge(chunks: KnowledgeChunk[]): Promise<void> {
    try {
      const indexResult = await this.searchClient.uploadDocuments(chunks)
      console.log(`🔥 Indexed ${indexResult.results.length} knowledge chunks for SuperSal`)
    } catch (error) {
      console.error('Failed to index knowledge:', error)
      throw error
    }
  }

  /**
   * 🔍 RETRIEVE KNOWLEDGE - Get relevant knowledge for SuperSal's responses
   */
  async retrieveKnowledge(
    query: string, 
    companion?: string, 
    topK: number = 5
  ): Promise<KnowledgeChunk[]> {
    try {
      // Generate query embedding
      const queryVector = await this.generateEmbedding(query)
      
      // Search with filters
      const searchOptions: any = {
        vector: {
          value: queryVector,
          kNearestNeighborsCount: topK,
          fields: ['vector']
        },
        select: ['id', 'content', 'title', 'source', 'companion', 'category', 'metadata', 'keywords'],
        top: topK
      }
      
      // Add companion filter if specified
      if (companion) {
        searchOptions.filter = `companion eq '${companion}' or companion eq 'universal'`
      }
      
      const searchResults = await this.searchClient.search(query, searchOptions)
      const results: KnowledgeChunk[] = []
      
      for await (const result of searchResults.results) {
        if (result.document) {
          results.push(result.document as KnowledgeChunk)
        }
      }
      
      console.log(`🧠 SuperSal retrieved ${results.length} relevant knowledge chunks`)
      return results
      
    } catch (error) {
      console.error('Failed to retrieve knowledge:', error)
      throw error
    }
  }

  // UTILITY METHODS
  private generateChunkId(source: string, index: number): string {
    const timestamp = Date.now()
    const sourceHash = source.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown'
    return `supersal_${sourceHash}_${index}_${timestamp}`
  }

  private extractTitle(content: string): string | null {
    const lines = content.split('\n')
    const firstLine = lines[0]?.trim()
    if (firstLine && firstLine.length < 100) {
      return firstLine.replace(/^#+\s*/, '')
    }
    return null
  }

  private splitWithOverlap(text: string, maxSize: number, overlap: number): string[] {
    const chunks = []
    let start = 0
    
    while (start < text.length) {
      const end = Math.min(start + maxSize, text.length)
      chunks.push(text.slice(start, end))
      start = end - overlap
      if (start >= text.length) break
    }
    
    return chunks
  }

  private extractFileType(source: string): string {
    const extension = source.split('.').pop()?.toLowerCase()
    return extension || 'unknown'
  }

  private calculateConfidence(content: string): number {
    // Simple confidence based on content length and structure
    const length = content.length
    const hasStructure = /#{1,3}\s+|\*\*|\-\s+/.test(content)
    const baseScore = Math.min(length / 1000, 1) * 0.7
    const structureBonus = hasStructure ? 0.3 : 0
    return Math.min(baseScore + structureBonus, 1)
  }

  private determinePriority(content: string): 'critical' | 'high' | 'medium' | 'low' {
    const contentLower = content.toLowerCase()
    
    if (contentLower.includes('critical') || contentLower.includes('urgent') || contentLower.includes('hacp')) {
      return 'critical'
    } else if (contentLower.includes('important') || contentLower.includes('sop') || contentLower.includes('patent')) {
      return 'high'
    } else if (contentLower.includes('training') || contentLower.includes('guide')) {
      return 'medium'
    }
    
    return 'low'
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'])
    return stopWords.has(word)
  }
}

export default SuperSalVectorizer
