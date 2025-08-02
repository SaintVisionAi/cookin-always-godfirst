// 🎯 SUPERSAL™ AZURE CONFIGURATION EMPIRE
// Built for Total Knowledge Domination & HACP™ Integration

// Node.js types for process.env
declare const process: {
  env: {
    [key: string]: string | undefined
  }
}

export interface AzureConfig {
  // OpenAI Services - The Brain 🧠
  openai: {
    endpoint: string
    apiKey: string
    apiVersion: string
    deployments: {
      gpt35Turbo: string          // Companion Mode
      gpt4Turbo: string           // Boss Mode
      gpt4Vision: string          // Visual Intelligence
      gpt4o: string               // SuperSal Boss Panel
      claude35Sonnet: string      // Advanced Reasoning
      embeddings: string          // Knowledge Vectorization
    }
  }
  
  // Cognitive Services
  cognitive: {
    endpoint: string
    apiKey: string
    region: string
    services: {
      textAnalytics: string
      documentIntelligence: string
      speechServices: string
      computerVision: string
    }
  }
  
  // Azure Search
  search: {
    endpoint: string
    apiKey: string
    indexName: string
    skillsetName: string
  }
  
  // Storage Account
  storage: {
    connectionString: string
    containerName: string
    endpoint: string
  }
  
  // Event Hub (for real-time ingestion)
  eventHub: {
    connectionString: string
    hubName: string
  }
  
  // Service Bus (for message queuing)
  serviceBus: {
    connectionString: string
    queueName: string
  }
}

export class AzureConfigManager {
  private static instance: AzureConfigManager
  private config: AzureConfig

  private constructor() {
    this.config = this.loadConfig()
  }

  public static getInstance(): AzureConfigManager {
    if (!AzureConfigManager.instance) {
      AzureConfigManager.instance = new AzureConfigManager()
    }
    return AzureConfigManager.instance
  }

  private loadConfig(): AzureConfig {
    return {
      openai: {
        endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
        apiKey: process.env.AZURE_OPENAI_API_KEY || "",
        apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-01",
        deployments: {
          gpt35Turbo: process.env.AZURE_GPT_35_TURBO_DEPLOYMENT || "",
          gpt4Turbo: process.env.AZURE_GPT_4_TURBO_DEPLOYMENT || "",
          gpt4Vision: process.env.AZURE_GPT_4_VISION_DEPLOYMENT || "",
          gpt4o: process.env.AZURE_GPT_4O_DEPLOYMENT || "",
          claude35Sonnet: process.env.AZURE_CLAUDE_35_SONNET_DEPLOYMENT || "",
          embeddings: process.env.AZURE_EMBEDDINGS_DEPLOYMENT || ""
        }
      },
      cognitive: {
        endpoint: process.env.AZURE_COGNITIVE_ENDPOINT || "",
        apiKey: process.env.AZURE_COGNITIVE_API_KEY || "",
        region: process.env.AZURE_COGNITIVE_REGION || "",
        services: {
          textAnalytics: process.env.AZURE_TEXT_ANALYTICS_ENDPOINT || "",
          documentIntelligence: process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || "",
          speechServices: process.env.AZURE_SPEECH_ENDPOINT || "",
          computerVision: process.env.AZURE_COMPUTER_VISION_ENDPOINT || ""
        }
      },
      search: {
        endpoint: process.env.AZURE_SEARCH_ENDPOINT || "",
        apiKey: process.env.AZURE_SEARCH_API_KEY || "",
        indexName: process.env.AZURE_SEARCH_INDEX_NAME || "supersal-index",
        skillsetName: process.env.AZURE_SEARCH_SKILLSET_NAME || "supersal-skillset"
      },
      storage: {
        connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || "",
        containerName: process.env.AZURE_STORAGE_CONTAINER || "supersal-data",
        endpoint: process.env.AZURE_STORAGE_ENDPOINT || ""
      },
      eventHub: {
        connectionString: process.env.AZURE_EVENT_HUB_CONNECTION_STRING || "",
        hubName: process.env.AZURE_EVENT_HUB_NAME || "supersal-events"
      },
      serviceBus: {
        connectionString: process.env.AZURE_SERVICE_BUS_CONNECTION_STRING || "",
        queueName: process.env.AZURE_SERVICE_BUS_QUEUE || "supersal-queue"
      }
    }
  }

  public getConfig(): AzureConfig {
    return this.config
  }

  public getOpenAIConfig() {
    return this.config.openai
  }

  public getCognitiveConfig() {
    return this.config.cognitive
  }

  public getSearchConfig() {
    return this.config.search
  }

  public getStorageConfig() {
    return this.config.storage
  }

  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!this.config.openai.endpoint) errors.push("Missing Azure OpenAI endpoint")
    if (!this.config.openai.apiKey) errors.push("Missing Azure OpenAI API key")
    if (!this.config.storage.connectionString) errors.push("Missing Azure Storage connection string")
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default AzureConfigManager.getInstance()
