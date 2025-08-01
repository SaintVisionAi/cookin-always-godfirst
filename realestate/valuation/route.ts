// 📦 app/api/realestate/valuation/route.ts — Real Estate Protocol (Fix & Flip + Commercial)
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const {
    propertyType,
    purchasePrice,
    rehabEstimate,
    arv,
    grossRent,
    expenses,
    noi,
    capRate,
    loanAmount,
    interestRate,
    termYears,
    propertyLocation
  } = await req.json()

  if (!propertyType || !purchasePrice || !propertyLocation) {
    return NextResponse.json({ error: "Missing required real estate data" }, { status: 400 })
  }

  try {
    let valuation = 0
    let strategy = ""
    let financingInsights = []
    let riskFlags = []
    let roi = null
    let dscr = null
    let monthlyDebt = null

    // 🛠 Fix & Flip Logic
    if (propertyType === "fix-n-flip") {
      const totalCost = purchasePrice + (rehabEstimate || 0)
      roi = arv && totalCost ? ((arv - totalCost) / totalCost) * 100 : null
      valuation = arv
      strategy = "Fix & Flip"
      financingInsights.push("Short-term rehab loan or hard money lender")

      if (roi && roi < 15) {
        riskFlags.push("⚠️ ROI below 15% — low margin flip")
      }
    }

    // 🏢 Commercial Logic
    if (propertyType === "commercial") {
      valuation = noi && capRate ? noi / (capRate / 100) : 0
      strategy = "Commercial Acquisition"
      financingInsights.push("DSCR-based lending or bridge-to-perm loan")

      if (loanAmount && interestRate && termYears) {
        const monthlyRate = interestRate / 100 / 12
        const numPayments = termYears * 12
        monthlyDebt = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
        dscr = noi && monthlyDebt ? noi / (monthlyDebt * 12) : null

        if (dscr && dscr < 1.25) {
          riskFlags.push("⚠️ DSCR below 1.25 — tight debt service coverage")
        }
      }
    }

    // 🧮 Rental Hold Logic
    if (propertyType === "rental") {
      const netIncome = grossRent - expenses
      valuation = netIncome * 12 / (capRate / 100)
      strategy = "Buy & Hold"
      financingInsights.push("Conventional loan or DSCR lender")
    }

    return NextResponse.json({
      status: "✅ Real Estate Protocol Complete",
      strategy,
      valuation: `$${valuation?.toLocaleString()}`,
      roi: roi ? `${roi.toFixed(2)}%` : null,
      dscr: dscr ? dscr.toFixed(2) : null,
      monthlyDebt: monthlyDebt ? `$${monthlyDebt.toFixed(2)}` : null,
      location: propertyLocation,
      financingInsights,
      riskFlags
    })
  } catch (err) {
    console.error("❌ Real Estate valuation error:", err)
    return NextResponse.json({ error: "Real estate analysis failed" }, { status: 500 })
  }
}
