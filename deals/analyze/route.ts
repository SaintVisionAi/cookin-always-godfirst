import { NextRequest, NextResponse } from "next/server"

interface DealData {
  id: string
  name: string
  company: string
  value: number
  probability: number
  stage: string
  industry?: string
  description?: string
  contact_name?: string
  contact_email?: string
  created_at: string
  score?: number
  ai_insights?: string[]
  recommended_actions?: string[]
  risk_factors?: string[]
}

export async function POST(req: NextRequest) {
  try {
    const { deals, analysisType = "comprehensive" } = await req.json()

    if (!deals || !Array.isArray(deals)) {
      return NextResponse.json(
        { error: "Deals array required" },
        { status: 400 }
      )
    }

    // AI-powered deal analysis using GPT
    const analyzedDeals = await Promise.all(
      deals.map(async (deal: any) => {
        try {
          const aiAnalysis = await analyzeWithGPT(deal, analysisType)
          return {
            ...deal,
            id: deal.id || crypto.randomUUID(),
            score: aiAnalysis.score,
            ai_insights: aiAnalysis.insights,
            recommended_actions: aiAnalysis.actions,
            risk_factors: aiAnalysis.risks,
            grade: getGrade(aiAnalysis.score),
            analyzed_at: new Date().toISOString()
          }
        } catch (error) {
          console.error(`Failed to analyze deal ${deal.name}:`, error)
          return {
            ...deal,
            id: deal.id || crypto.randomUUID(),
            score: 50,
            ai_insights: ["Analysis unavailable"],
            recommended_actions: ["Manual review required"],
            risk_factors: ["Unable to assess automatically"],
            grade: "C",
            analyzed_at: new Date().toISOString()
          }
        }
      })
    )

    // Portfolio-level insights
    const portfolioInsights = generatePortfolioInsights(analyzedDeals)

    return NextResponse.json({
      success: true,
      data: {
        deals: analyzedDeals,
        portfolio_insights: portfolioInsights,
        total_deals: analyzedDeals.length,
        avg_score: portfolioInsights.average_score,
        high_priority_count: analyzedDeals.filter(d => d.score >= 80).length
      },
      message: "🧠 Deals analyzed by SaintSal™ AI"
    })
  } catch (error) {
    console.error("Deal analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze deals" },
      { status: 500 }
    )
  }
}

async function analyzeWithGPT(deal: any, analysisType: string) {
  if (!process.env.AZURE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured")
  }

  const prompt = `You are SaintSal™, an expert AI deal analyzer. Analyze this deal and provide insights:

Deal Details:
- Name: ${deal.name}
- Company: ${deal.company}
- Value: $${deal.value}
- Probability: ${deal.probability}%
- Stage: ${deal.stage}
- Industry: ${deal.industry || "Unknown"}
- Description: ${deal.description || "No description"}

Provide analysis as JSON with:
- score (0-100): Overall deal quality score
- insights (array): 3-5 key insights about this deal
- actions (array): 3-4 recommended next actions
- risks (array): 2-3 potential risk factors

Focus on business value, probability of close, and strategic importance.`

  try {
    const response = await fetch(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_ID}/chat/completions?api-version=2024-06-01`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY!
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are SaintSal™, an expert AI deal analyzer. Always respond with valid JSON only."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.3
        })
      }
    )

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const gptData = await response.json()
    const content = gptData.choices?.[0]?.message?.content

    if (content) {
      try {
        const parsed = JSON.parse(content)
        return {
          score: Math.max(0, Math.min(100, parsed.score || 50)),
          insights: Array.isArray(parsed.insights)
            ? parsed.insights
            : ["AI analysis completed"],
          actions: Array.isArray(parsed.actions)
            ? parsed.actions
            : ["Review deal details"],
          risks: Array.isArray(parsed.risks)
            ? parsed.risks
            : ["Standard business risks"]
        }
      } catch (parseError) {
        console.error("Failed to parse GPT response:", parseError)
        throw new Error("Invalid AI response format")
      }
    }

    throw new Error("No content in AI response")
  } catch (error) {
    console.error("GPT analysis error:", error)

    // Fallback scoring algorithm
    const score = calculateFallbackScore(deal)
    return {
      score,
      insights: [
        `Deal value: $${deal.value.toLocaleString()}`,
        `${deal.probability}% probability of closing`,
        `Currently in ${deal.stage} stage`,
        "AI analysis using fallback scoring"
      ],
      actions: [
        "Schedule follow-up call",
        "Verify decision timeline",
        "Confirm budget approval",
        "Address any objections"
      ],
      risks: [
        "Competition from other vendors",
        "Budget constraints",
        "Decision timeline uncertainty"
      ]
    }
  }
}

function calculateFallbackScore(deal: any): number {
  let score = 50 // Base score

  // Value scoring (0-25 points)
  if (deal.value > 100000) score += 25
  else if (deal.value > 50000) score += 20
  else if (deal.value > 10000) score += 15
  else if (deal.value > 5000) score += 10

  // Probability scoring (0-30 points)
  score += Math.min(30, deal.probability * 0.3)

  // Stage scoring (0-20 points)
  const stageScores: { [key: string]: number } = {
    discovery: 5,
    qualification: 8,
    proposal: 12,
    negotiation: 16,
    closing: 20,
    closed: 20
  }
  score += stageScores[deal.stage?.toLowerCase()] || 5

  // Industry scoring (0-15 points)
  const highValueIndustries = [
    "technology",
    "finance",
    "healthcare",
    "enterprise"
  ]
  if (
    deal.industry &&
    highValueIndustries.some(ind => deal.industry.toLowerCase().includes(ind))
  ) {
    score += 15
  } else if (deal.industry) {
    score += 8
  }

  // Recent activity (0-10 points)
  const daysOld = deal.created_at
    ? (Date.now() - new Date(deal.created_at).getTime()) / (1000 * 60 * 60 * 24)
    : 30
  if (daysOld < 7) score += 10
  else if (daysOld < 30) score += 5

  return Math.max(0, Math.min(100, Math.round(score)))
}

function getGrade(score: number): string {
  if (score >= 90) return "A+"
  if (score >= 80) return "A"
  if (score >= 70) return "B"
  if (score >= 60) return "C"
  return "D"
}

function generatePortfolioInsights(deals: DealData[]) {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const averageScore =
    deals.reduce((sum, deal) => sum + (deal.score || 0), 0) / deals.length
  const topDeals = deals.filter(deal => (deal.score || 0) >= 80)
  const riskDeals = deals.filter(deal => (deal.score || 0) < 50)

  const stageDistribution = deals.reduce(
    (acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1
      return acc
    },
    {} as { [key: string]: number }
  )

  return {
    total_value: totalValue,
    average_score: Math.round(averageScore),
    high_priority_deals: topDeals.length,
    at_risk_deals: riskDeals.length,
    stage_distribution: stageDistribution,
    recommendations: [
      topDeals.length > 0
        ? "Focus on closing high-priority deals first"
        : "Work on improving deal quality",
      riskDeals.length > 0
        ? `${riskDeals.length} deals need immediate attention`
        : "Portfolio health looks good",
      `Average deal score: ${Math.round(averageScore)} - ${averageScore >= 70 ? "Strong" : "Needs improvement"}`
    ]
  }
}

export async function GET(req: NextRequest) {
  // Return sample deals for demo purposes
  const sampleDeals = [
    {
      id: "1",
      name: "Enterprise CRM Implementation",
      company: "TechCorp Inc",
      value: 150000,
      probability: 75,
      stage: "negotiation",
      industry: "technology",
      contact_name: "Sarah Johnson",
      contact_email: "sarah@techcorp.com",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "2",
      name: "Marketing Automation Setup",
      company: "Growth Dynamics",
      value: 45000,
      probability: 60,
      stage: "proposal",
      industry: "marketing",
      contact_name: "Mike Chen",
      contact_email: "mike@growthdynamics.com",
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      name: "AI Integration Project",
      company: "Future Solutions",
      value: 85000,
      probability: 90,
      stage: "closing",
      industry: "artificial intelligence",
      contact_name: "Dr. Lisa Park",
      contact_email: "lisa@futuresolutions.ai",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  return NextResponse.json({
    success: true,
    data: sampleDeals,
    message: "Sample deals for SaintSal™ analysis"
  })
}
