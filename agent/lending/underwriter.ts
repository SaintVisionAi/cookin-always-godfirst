// 📦 app/api/agent/lending/underwriter.ts — Lending Protocol Handler

import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { borrowerType, creditScore, revenue, debt, country, collateral } = await req.json()

  if (!borrowerType || !creditScore || !revenue) {
    return NextResponse.json({ error: "Missing lending data" }, { status: 400 })
  }

  try {
    let eligibility = false
    let risk = "Unknown"
    let loanAmount = 0
    let reasoning = ""

    if (borrowerType === "individual") {
      risk = creditScore > 720 ? "Low" : creditScore > 600 ? "Moderate" : "High"
      eligibility = creditScore >= 580
      loanAmount = creditScore * 10
      reasoning = `Scored based on FICO estimate with collateral=${!!collateral}`
    } else if (borrowerType === "business") {
      const dti = debt / revenue
      risk = dti < 0.3 ? "Low" : dti < 0.6 ? "Moderate" : "High"
      eligibility = revenue > 50000 && dti < 0.6
      loanAmount = revenue * 0.25
      reasoning = `Evaluated via DTI ratio and revenue strength`
    }

    const flags: string[] = []
    if (country !== "US") flags.push("📍 Foreign Lending — check cross-border compliance")
    if (!collateral) flags.push("⚠️ No collateral attached")

    return NextResponse.json({
      eligibility,
      risk,
      maxLoanOffer: `$${loanAmount.toLocaleString()}`,
      complianceNotes: flags,
      reasoning
    })
  } catch (err) {
    console.error("❌ Lending protocol error:", err)
    return NextResponse.json({ error: "Lending evaluation failed" }, { status: 500 })
  }
}
