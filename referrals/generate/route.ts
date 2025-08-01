import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const {
      partner_name,
      partner_email,
      commission_rate = 10
    } = await req.json()

    const supabase = createServerComponentClient({ cookies })

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate unique referral code
    const referralCode = generateReferralCode(partner_name)

    // Create partner record
    const { data: partner, error: partnerError } = await supabase
      .from("referral_partners")
      .insert({
        id: crypto.randomUUID(),
        referral_code: referralCode,
        partner_name,
        partner_email,
        commission_rate,
        created_by: user.id,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (partnerError) {
      console.error("Partner creation error:", partnerError)
      return NextResponse.json(
        { error: "Failed to create referral partner" },
        { status: 500 }
      )
    }

    // Generate referral links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://saintsal.com"
    const referralLinks = {
      landing: `${baseUrl}?ref=${referralCode}`,
      signup: `${baseUrl}/setup?ref=${referralCode}`,
      demo: `${baseUrl}/demo?ref=${referralCode}`
    }

    return NextResponse.json({
      success: true,
      data: {
        partner,
        referralCode,
        referralLinks,
        trackingUrl: `${baseUrl}/api/referrals/track?code=${referralCode}`
      },
      message: "🔥 Referral partner created successfully!"
    })
  } catch (error) {
    console.error("Referral generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate referral code" },
      { status: 500 }
    )
  }
}

function generateReferralCode(partnerName: string): string {
  // Create a referral code based on partner name + random string
  const cleanName = partnerName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 6)
    .toUpperCase()

  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase()

  return `SAINT${cleanName}${randomString}`
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: partners, error } = await supabase
      .from("referral_partners")
      .select("*")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch partners" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: partners
    })
  } catch (error) {
    console.error("Fetch partners error:", error)
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    )
  }
}
