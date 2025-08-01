// 📦 app/api/agent/register-entity/route.ts — Global Entity Commander

import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: NextRequest) {
  const { name, country, type } = await req.json()
  if (!name || !country || !type) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 })
  }

  try {
    const corpLookup = await axios.get(`https://api.opencorporates.com/v0.4/companies/search`, {
      params: {
        q: name,
        jurisdiction_code: country.toLowerCase()
      }
    })

    const intel = corpLookup.data?.results?.companies || []

    return NextResponse.json({
      entity: name,
      country,
      type,
      found: intel.length,
      recommendations: intel.slice(0, 3)
    })
  } catch (err) {
    console.error("❌ Entity search error:", err)
    return NextResponse.json({ error: "Entity lookup failed" }, { status: 500 })
  }
}
