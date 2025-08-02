// 📦 app/api/agent/feedback/route.ts — User Feedback Handler
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { feedback } = await req.json()
  
  try {
    // TODO: Implement Notion integration
    console.log('Feedback received:', feedback)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
  }
}
