// 📦 app/api/agent/lending/route.ts — Lending Ops Protocol

import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { loanAmount, propertyValue, income, termYears, state } = await req.json()

  if (!loanAmount || !propertyValue || !income || !termYears) {
    return NextResponse.json({ error: "Missing loan parameters" }, { status: 400 })
  }

  try {
    const LTV = +(loanAmount / propertyValue).toFixed(2)
    const DTI = +((loanAmount / (income * 12)).toFixed(2))
    const rate = LTV > 0.8 ? 0.085 : 0.06
    const monthly = ((loanAmount * rate) / 12) || 0
    const totalCost = monthly * 12 * termYears

    const decision =
      LTV > 0.9 || DTI > 0.5
        ? "Decline — Risk thresholds exceeded"
        : "Approved — Issue term sheet"

    const guidance =
      state === "CA"
        ? "CA DBO license required. Usury cap 10% unless exempt."
        : "Ensure proper lending license for region."

    return NextResponse.json({
      status: "✅ Lending Evaluation Complete",
      loanAmount,
      propertyValue,
      LTV,
      DTI,
      estimatedRate: rate,
      monthlyPayment: monthly,
      totalLoanCost: totalCost,
      decision,
      guidance
    })
  } catch (err) {
    console.error("❌ Lending logic error:", err)
    return NextResponse.json({ error: "Lending protocol failed" }, { status: 500 })
  }
}
