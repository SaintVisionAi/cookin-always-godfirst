// 🔍 SUPERSAL™ AZURE COGNITIVE SEARCH SERVICE
// Hybrid Vector + Keyword Search for Total Knowledge Retrieval
// "The Brain's Library - Fast, Smart, Always Accurate"

import { AzureConfigManager } from '../config'

export interface SearchDocument {
  id: string
  title: string
  content: string
  companions: string[]
  tags: string[]
  priority: string
  domain: string[]
  confidentiality: string
  dateIngested: string
  vectorEmbedding?: number[]
}

export interface SearchQuery {
  query: string
  companions?: string[]
  tags?: string[]
  domains?: string[]
  confidentiality?: string[]
  top?: number
  semanticSearch?: boolean
}

export interface SearchResult {
  document: SearchDocument
  score: number
  highlights: string[]
}

export interface SearchResponse {
  results: SearchResult[]
  totalCount: number
  query: SearchQuery
  executionTime: number
}

export class AzureSearchService {
  private config: any
  private indexName: string
  private endpoint: string
  private apiKey: string

  constructor() {
    const azureConfig = AzureConfigManager.getInstance()
    this.config = azureConfig.getSearchConfig()
    this.indexName = this.config.indexName
    this.endpoint = this.config.endpoint
    this.apiKey = this.config.apiKey
  }

  /**
   * 🔍 HYBRID SEARCH
   * Combines vector similarity with keyword matching
   */
  async search(query: SearchQuery): Promise<SearchResponse> {
    const startTime = Date.now()
    
    try {
      console.log('🔍 SuperSal Search:', query.query)
      
      // Build search request
      const searchRequest = this.buildSearchRequest(query)
      
      // Execute search against Azure Cognitive Search
      const response = await this.executeSearch(searchRequest)
      
      // Process and rank results
      const results = this.processSearchResults(response, query)
      
      const executionTime = Date.now() - startTime
      
      console.log(`✅ Search completed in ${executionTime}ms, found ${results.length} results`)
      
      return {
        results,
        totalCount: response['@odata.count'] || results.length,
        query,
        executionTime
      }
      
    } catch (error) {
      console.error('❌ Search failed:', error)
      throw new Error(`SuperSal search failed: ${error}`)
    }
  }

  /**
   * 📝 INDEX DOCUMENT
   * Adds document to SuperSal's knowledge base
   */
  async indexDocument(document: SearchDocument): Promise<void> {
    try {
      console.log(`📝 Indexing: ${document.title}`)
      
      const indexRequest = {
        value: [
          {
            '@search.action': 'mergeOrUpload',
            ...document
          }
        ]
      }
      
      const url = `${this.endpoint}/indexes/${this.indexName}/docs/index?api-version=2023-11-01`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(indexRequest)
      })
      
      if (!response.ok) {
        throw new Error(`Index failed: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.value?.[0]?.status !== 'succeeded') {
        throw new Error(`Index failed: ${result.value?.[0]?.errorMessage}`)
      }
      
      console.log(`✅ Indexed: ${document.title}`)
      
    } catch (error) {
      console.error(`❌ Failed to index ${document.title}:`, error)
      throw error
    }
  }

  /**
   * 🏗️ CREATE INDEX
   * Sets up the SuperSal knowledge index schema
   */
  async createIndex(): Promise<void> {
    try {
      console.log('🏗️ Creating SuperSal knowledge index...')
      
      const indexSchema = this.buildIndexSchema()
      
      const url = `${this.endpoint}/indexes/${this.indexName}?api-version=2023-11-01`
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(indexSchema)
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Create index failed: ${error}`)
      }
      
      console.log('✅ SuperSal knowledge index created successfully!')
      
    } catch (error) {
      console.error('❌ Failed to create index:', error)
      throw error
    }
  }

  /**
   * 🧹 DELETE INDEX
   * Removes the index (use with caution!)
   */
  async deleteIndex(): Promise<void> {
    try {
      const url = `${this.endpoint}/indexes/${this.indexName}?api-version=2023-11-01`
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'api-key': this.apiKey
        }
      })
      
      if (!response.ok && response.status !== 404) {
        throw new Error(`Delete failed: ${response.statusText}`)
      }
      
      console.log('🗑️ Index deleted successfully')
      
    } catch (error) {
      console.error('❌ Failed to delete index:', error)
      throw error
    }
  }

  /**
   * 📊 GET INDEX STATS
   * Returns statistics about the knowledge base
   */
  async getIndexStats(): Promise<any> {
    try {
      const url = `${this.endpoint}/indexes/${this.indexName}/stats?api-version=2023-11-01`
      
      const response = await fetch(url, {
        headers: {
          'api-key': this.apiKey
        }
      })
      
      if (!response.ok) {
        throw new Error(`Stats failed: ${response.statusText}`)
      }
      
      return await response.json()
      
    } catch (error) {
      console.error('❌ Failed to get stats:', error)
      throw error
    }
  }

  // Private helper methods

  private buildSearchRequest(query: SearchQuery): any {
    const request: any = {
      search: query.query,
      searchMode: 'all',
      queryType: query.semanticSearch ? 'semantic' : 'simple',
      top: query.top || 10,
      highlight: 'content,title',
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      count: true
    }

    // Add filters
    const filters: string[] = []
    
    if (query.companions && query.companions.length > 0) {
      const companionFilter = query.companions
        .map(c => `companions/any(c: c eq '${c}')`)
        .join(' or ')
      filters.push(`(${companionFilter})`)
    }
    
    if (query.tags && query.tags.length > 0) {
      const tagFilter = query.tags
        .map(t => `tags/any(t: t eq '${t}')`)
        .join(' or ')
      filters.push(`(${tagFilter})`)
    }
    
    if (query.domains && query.domains.length > 0) {
      const domainFilter = query.domains
        .map(d => `domain/any(d: d eq '${d}')`)
        .join(' or ')
      filters.push(`(${domainFilter})`)
    }
    
    if (query.confidentiality && query.confidentiality.length > 0) {
      const confFilter = query.confidentiality
        .map(c => `confidentiality eq '${c}'`)
        .join(' or ')
      filters.push(`(${confFilter})`)
    }
    
    if (filters.length > 0) {
      request.filter = filters.join(' and ')
    }

    // Add semantic search configuration if enabled
    if (query.semanticSearch) {
      request.semanticConfiguration = 'supersal-semantic-config'
      request.queryLanguage = 'en-us'
    }

    return request
  }

  private async executeSearch(searchRequest: any): Promise<any> {
    const url = `${this.endpoint}/indexes/${this.indexName}/docs/search?api-version=2023-11-01`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      },
      body: JSON.stringify(searchRequest)
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Search request failed: ${error}`)
    }
    
    return await response.json()
  }

  private processSearchResults(response: any, query: SearchQuery): SearchResult[] {
    const results: SearchResult[] = []
    
    for (const hit of response.value || []) {
      const result: SearchResult = {
        document: {
          id: hit.id,
          title: hit.title,
          content: hit.content,
          companions: hit.companions || [],
          tags: hit.tags || [],
          priority: hit.priority,
          domain: hit.domain || [],
          confidentiality: hit.confidentiality,
          dateIngested: hit.dateIngested,
          vectorEmbedding: hit.vectorEmbedding
        },
        score: hit['@search.score'],
        highlights: this.extractHighlights(hit['@search.highlights'])
      }
      
      results.push(result)
    }
    
    return results
  }

  private extractHighlights(highlights: any): string[] {
    const extracted: string[] = []
    
    if (highlights) {
      for (const field in highlights) {
        if (highlights[field]) {
          extracted.push(...highlights[field])
        }
      }
    }
    
    return extracted
  }

  private buildIndexSchema(): any {
    return {
      name: this.indexName,
      fields: [
        {
          name: 'id',
          type: 'Edm.String',
          key: true,
          searchable: false,
          filterable: false,
          sortable: false,
          facetable: false
        },
        {
          name: 'title',
          type: 'Edm.String',
          searchable: true,
          filterable: false,
          sortable: true,
          facetable: false,
          analyzer: 'en.microsoft'
        },
        {
          name: 'content',
          type: 'Edm.String',
          searchable: true,
          filterable: false,
          sortable: false,
          facetable: false,
          analyzer: 'en.microsoft'
        },
        {
          name: 'companions',
          type: 'Collection(Edm.String)',
          searchable: true,
          filterable: true,
          sortable: false,
          facetable: true
        },
        {
          name: 'tags',
          type: 'Collection(Edm.String)',
          searchable: true,
          filterable: true,
          sortable: false,
          facetable: true
        },
        {
          name: 'priority',
          type: 'Edm.String',
          searchable: false,
          filterable: true,
          sortable: true,
          facetable: true
        },
        {
          name: 'domain',
          type: 'Collection(Edm.String)',
          searchable: true,
          filterable: true,
          sortable: false,
          facetable: true
        },
        {
          name: 'confidentiality',
          type: 'Edm.String',
          searchable: false,
          filterable: true,
          sortable: false,
          facetable: true
        },
        {
          name: 'dateIngested',
          type: 'Edm.DateTimeOffset',
          searchable: false,
          filterable: true,
          sortable: true,
          facetable: false
        },
        {
          name: 'vectorEmbedding',
          type: 'Collection(Edm.Single)',
          searchable: true,
          filterable: false,
          sortable: false,
          facetable: false,
          dimensions: 1536,
          vectorSearchProfile: 'supersal-vector-profile'
        }
      ],
      vectorSearch: {
        algorithms: [
          {
            name: 'supersal-hnsw-algorithm',
            kind: 'hnsw',
            hnswParameters: {
              metric: 'cosine',
              m: 4,
              efConstruction: 400,
              efSearch: 500
            }
          }
        ],
        profiles: [
          {
            name: 'supersal-vector-profile',
            algorithm: 'supersal-hnsw-algorithm'
          }
        ]
      },
      semantic: {
        configurations: [
          {
            name: 'supersal-semantic-config',
            prioritizedFields: {
              titleField: {
                fieldName: 'title'
              },
              prioritizedContentFields: [
                {
                  fieldName: 'content'
                }
              ],
              prioritizedKeywordsFields: [
                {
                  fieldName: 'tags'
                }
              ]
            }
          }
        ]
      }
    }
  }
}

export default AzureSearchService
