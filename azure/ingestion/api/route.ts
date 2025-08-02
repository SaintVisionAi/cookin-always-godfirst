// 🚀 SUPERSAL™ BRAIN INGESTION API
// Feed SuperSal's brain with ALL the knowledge!

import { ingestWorkspaceKnowledge, getBrainStatus } from "../processor"

export const runtime = "nodejs"

// 🧠 POST - Ingest knowledge into SuperSal's brain
export async function POST() {
  try {
    console.log("🚀 Starting SuperSal knowledge ingestion...")
    
    const result = await ingestWorkspaceKnowledge()
    
    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: "🎉 SuperSal's brain has been fed and is now GODLIKE!",
        data: result
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: "❌ SuperSal brain ingestion failed",
        data: result
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
  } catch (error) {
    console.error("❌ SuperSal ingestion error:", error)
    
    return new Response(JSON.stringify({
      success: false,
      message: `💥 SuperSal brain ingestion crashed: ${error}`,
      error: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// 📊 GET - Check SuperSal's brain status
export async function GET() {
  try {
    const status = await getBrainStatus()
    
    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error("❌ Brain status check failed:", error)
    
    return new Response(JSON.stringify({
      status: "❌ Error",
      message: `Failed to check SuperSal's brain: ${error}`,
      error: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
