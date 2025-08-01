// 📦 app/api/lending/underwriting/route.ts — Lending Underwriting Protocol
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const {
    loanAmount,
    propertyValue,
    creditScore,
    income,
    monthlyDebt,
    loanType,
    occupancy,
    state
  } = await req.json()

  if (!loanAmount || !propertyValue || !creditScore || !income || !monthlyDebt) {
    return NextResponse.json({ error: "Missing underwriting data" }, { status: 400 })
  }

  try {
    const ltv = (loanAmount / propertyValue) * 100
    const dti = (monthlyDebt / (income / 12)) * 100
    const fhaEligible = creditScore >= 580 && ltv <= 96.5
    const conventionalEligible = creditScore >= 620 && ltv <= 80 && dti <= 43

    const riskLevel = creditScore < 600 || dti > 50
      ? "high"
      : creditScore > 720 && dti < 36
        ? "low"
        : "medium"

    const recommendation = riskLevel === "low"
      ? "Approve with streamlined conditions"
      : riskLevel === "medium"
        ? "Review with compensating factors"
        : "Flag for manual underwriting"

    return NextResponse.json({
      status: "✅ Underwriting Evaluated",
      ltv: `${ltv.toFixed(2)}%`,
      dti: `${dti.toFixed(2)}%`,
      fhaEligible,
      conventionalEligible,
      riskLevel,
      recommendation
    })
  } catch (err) {
    console.error("❌ Underwriting error:", err)
    return NextResponse.json({ error: "Underwriting failed" }, { status: 500 })
  }
}
