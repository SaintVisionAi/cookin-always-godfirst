import { NextRequest, NextResponse } from "next/server"

interface CompanyData {
  name: string
  domain: string
  description?: string
  industry?: string
  employees?: string
  founded?: string
  headquarters?: string
  logo?: string
  linkedin?: string
  website?: string
  phone?: string
  email?: string
  score?: number
}

export async function POST(req: NextRequest) {
  try {
    const { query, type = "company" } = await req.json()

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter required" },
        { status: 400 }
      )
    }

    let companyData: CompanyData | null = null

    // Try Clearbit API first (if available)
    if (process.env.CLEARBIT_API_KEY) {
      try {
        const clearbitResponse = await fetch(
          `https://company-stream.clearbit.com/v2/companies/find?domain=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.CLEARBIT_API_KEY}`
            }
          }
        )

        if (clearbitResponse.ok) {
          const data = await clearbitResponse.json()
          companyData = {
            name: data.name || "Unknown Company",
            domain: data.domain || query,
            description: data.description,
            industry: data.category?.industry,
            employees: data.metrics?.employees,
            founded: data.foundedYear?.toString(),
            headquarters:
              data.geo?.city && data.geo?.country
                ? `${data.geo.city}, ${data.geo.country}`
                : undefined,
            logo: data.logo,
            linkedin: data.linkedin?.handle,
            website: data.domain,
            score: Math.floor(Math.random() * 100) + 1 // AI scoring placeholder
          }
        }
      } catch (clearbitError) {
        console.log("Clearbit API failed, trying fallback methods")
      }
    }

    // Fallback: AI-enhanced enrichment using GPT
    if (!companyData && process.env.AZURE_OPENAI_API_KEY) {
      try {
        const gptResponse = await fetch(
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
                    "You are SaintSal™, an AI assistant that enriches company data. Return company information as valid JSON only."
                },
                {
                  role: "user",
                  content: `Find information about the company: "${query}". Return as JSON with fields: name, domain, description, industry, employees, founded, headquarters, website. If you can't find real data, return null values but always include the structure.`
                }
              ],
              max_tokens: 500,
              temperature: 0.3
            })
          }
        )

        if (gptResponse.ok) {
          const gptData = await gptResponse.json()
          const content = gptData.choices?.[0]?.message?.content

          if (content) {
            try {
              const parsed = JSON.parse(content)
              companyData = {
                ...parsed,
                domain: parsed.domain || query,
                score: Math.floor(Math.random() * 100) + 1
              }
            } catch (parseError) {
              // GPT didn't return valid JSON, create basic structure
              companyData = {
                name: query,
                domain: query,
                description: "Company information enriched by SaintSal™ AI",
                score: 75
              }
            }
          }
        }
      } catch (gptError) {
        console.log("GPT enrichment failed")
      }
    }

    // Final fallback: Basic structure
    if (!companyData) {
      companyData = {
        name: query,
        domain: query,
        description: "Lead discovered by SaintSal™ - ready for enrichment",
        score: 50
      }
    }

    // Add SaintSal AI scoring (simulate intelligent analysis)
    const enhancedData = {
      ...companyData,
      score: calculateLeadScore(companyData),
      timestamp: new Date().toISOString(),
      source: "SaintSal™ Discovery Engine",
      status: "discovered"
    }

    return NextResponse.json({
      success: true,
      data: enhancedData,
      message: "🔥 Lead discovered by SaintSal™"
    })
  } catch (error) {
    console.error("Lead discovery error:", error)
    return NextResponse.json(
      { error: "Failed to discover lead information" },
      { status: 500 }
    )
  }
}

function calculateLeadScore(company: CompanyData): number {
  let score = 50 // Base score

  // Industry scoring
  const highValueIndustries = [
    "technology",
    "finance",
    "healthcare",
    "real estate",
    "consulting"
  ]
  if (
    company.industry &&
    highValueIndustries.some(ind =>
      company.industry!.toLowerCase().includes(ind)
    )
  ) {
    score += 20
  }

  // Employee count scoring
  if (company.employees) {
    const empCount = parseInt(company.employees.replace(/\D/g, ""))
    if (empCount > 100) score += 15
    if (empCount > 500) score += 10
  }

  // Website presence
  if (company.website) score += 10
  if (company.linkedin) score += 10

  // Founded date (established companies)
  if (company.founded) {
    const founded = parseInt(company.founded)
    const yearsInBusiness = new Date().getFullYear() - founded
    if (yearsInBusiness > 5) score += 10
    if (yearsInBusiness > 10) score += 5
  }

  return Math.min(Math.max(score, 0), 100)
}
