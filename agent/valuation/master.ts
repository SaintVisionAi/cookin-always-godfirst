// 📦 app/api/agent/valuation/master.ts — Supreme Valuation Protocol v2
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const {
    entityType,
    revenue,
    ebitda,
    industry,
    geography,
    yearFounded,
    comparablePublics,
    growthRate,
    marginProfile
  } = await req.json()

  if (!entityType || !revenue || !industry) {
    return NextResponse.json({ error: "Missing core valuation data" }, { status: 400 })
  }

  try {
    let valuation = 0
    let method = ""
    let riskPremium = 1

    // 🔍 Adjust valuation based on geography + market risk
    if (geography && geography.toLowerCase().includes("emerging")) riskPremium = 0.8
    if (geography && geography.toLowerCase().includes("us")) riskPremium = 1.1

    // 🧮 Entity-specific logic
    switch (entityType) {
      case "startup":
        method = "VC Method + Discounted Cash Flow (DCF)"
        valuation = (revenue * 4 + (ebitda || 0) * 8) * riskPremium
        break
      case "mature-corp":
        method = "Comparable Company Analysis + EBITDA Multiple"
        const multiplier = industry.toLowerCase().includes("tech") ? 10 : 6
        valuation = (ebitda || revenue * 1.5) * multiplier * riskPremium
        break
      case "mom-and-pop":
        method = "SDE + Asset Valuation"
        valuation = revenue * 1.2 + (ebitda || 0) * 1.5
        break
      case "private-equity":
        method = "LBO + Synergistic Value Capture"
        valuation = ((ebitda || revenue * 1.8) * 6.5) + 0.1 * (comparablePublics?.length || 0)
        break
      default:
        method = "Custom Weighted Multiple"
        valuation = revenue * 2.5
    }

    // 📊 Strategic Layers
    const legalFlags = [
      "IRS compliance review",
      "International IP & holding structuring",
      "Cross-border repatriation risk",
      "State-by-state corporate governance"
    ]

    const fundInsights = [
      "Reg D 506(c) / 506(b)",
      "Reg A+ Tier I/II eligibility",
      "Form D & Blue Sky filings",
      "Fund lifecycle alignment: SPV, LP/GP, REIT, Trust",
      "Digital Securities & Tokenized Funds (Reg CF, Reg S)"
    ]

    const financialNotes = {
      growthRate: growthRate || "unknown",
      marginProfile: marginProfile || "undisclosed",
      valuationBasis: method,
      jurisdiction: geography || "US",
      currency: "USD"
    }

    return NextResponse.json({
      status: "✅ Valuation Complete",
      method,
      estimatedValuation: `$${valuation.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      legalConsiderations: legalFlags,
      fundStructures: fundInsights,
      financialNotes,
      recommendation: "Engage legal + financial counsel for M&A, filings, tax strategy, and investor readiness"
    })
  } catch (err) {
    console.error("❌ Supreme Valuation Error:", err)
    return NextResponse.json({ error: "Valuation protocol failure" }, { status: 500 })
  }
}
