// 📦 app/api/agent/real-estate/route.ts — Global Real Estate Ops

import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: NextRequest) {
  const { address, intent } = await req.json()
  if (!address || !intent) {
    return NextResponse.json({ error: "Missing address or intent" }, { status: 400 })
  }

  try {
    // Placeholder: Use Zillow, Estated, or Parcel APIs
    const parcelData = await axios.get(`https://api.api-ninjas.com/v1/properties?address=${encodeURIComponent(address)}`, {
      headers: { "X-Api-Key": process.env.PARCEL_API_KEY || "" }
    })

    const props = parcelData.data || []

    const recommendation = {
      hold: "Good rental market, projected appreciation 6%/yr",
      flip: "Needs minor rehab, high resale margin",
      buy: "Undervalued listing in growth corridor"
    }

    return NextResponse.json({
      address,
      intent,
      propertiesFound: props.length,
      details: props[0] || {},
      strategy: recommendation[intent.toLowerCase()] || "No strategy available"
    })
  } catch (err) {
    console.error("❌ Real estate query error:", err)
    return NextResponse.json({ error: "Property intelligence failed" }, { status: 500 })
  }
}
