// 📦 app/api/agent/investments/route.ts — Global Investment Protocol

import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const {
    assetType,
    capital,
    timeHorizonYears,
    riskTolerance,
    targetIRR,
    revenue,
    ebitda,
    industry
  } = await req.json()

  if (!assetType || !capital || !timeHorizonYears || !riskTolerance) {
    return NextResponse.json({ error: "Missing investment inputs" }, { status: 400 })
  }

  try {
    let recommendation = ""
    let expectedReturn = 0
    let strategy = ""

    switch (assetType.toLowerCase()) {
      case "stocks":
        expectedReturn = 0.08
        strategy = "Diversify across S&P 500, mid-cap growth, and global tech."
        break
      case "bonds":
        expectedReturn = 0.04
        strategy = "Blend of T-bills, corporate bonds, and municipal tax-free bonds."
        break
      case "real estate":
        expectedReturn = 0.12
        strategy = "Use leverage on multifamily or commercial assets with DSCR > 1.25."
        break
      case "private equity":
        expectedReturn = 0.20
        strategy = "Deploy via SPV or fund-of-funds in late-stage growth companies."
        break
      case "venture capital":
        expectedReturn = 0.30
        strategy = "Diversify early-stage bets, track burn rate, and exit via secondary or IPO."
        break
      case "crypto":
        expectedReturn = 0.15
        strategy = "BTC/ETH core + 10% in alt L2s or DeFi protocols."
        break
      default:
        expectedReturn = 0.10
        strategy = "Blend traditional and alternative assets for resilient growth."
        break
    }

    // M&A Valuation Logic (if provided)
    let valuation = null
    if (revenue && ebitda) {
      const ebitdaMultiple = industry?.toLowerCase() === "tech" ? 12 : 6
      valuation = +(ebitda * ebitdaMultiple).toFixed(2)
      recommendation = `Estimated M&A Valuation: $${valuation.toLocaleString()} based on ${ebitdaMultiple}x EBITDA`
    }

    const projectedValue = +(capital * Math.pow(1 + expectedReturn, timeHorizonYears)).toFixed(2)

    return NextResponse.json({
      status: "✅ Investment Profile Created",
      assetType,
      capital,
      riskTolerance,
      timeHorizonYears,
      expectedAnnualReturn: expectedReturn,
      projectedPortfolioValue: projectedValue,
      strategy,
      recommendation,
      valuation
    })
  } catch (err) {
    console.error("❌ Investment logic error:", err)
    return NextResponse.json({ error: "Investment analysis failed" }, { status: 500 })
  }
}
