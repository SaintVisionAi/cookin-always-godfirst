import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const { referral_code, lead_email, lead_name, partner_id } =
      await req.json()

    const supabase = createServerComponentClient({ cookies })

    // Get the current user
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create referral tracking record
    const { data: referral, error: referralError } = await supabase
      .from("referrals")
      .insert({
        id: crypto.randomUUID(),
        referral_code,
        lead_email,
        lead_name,
        partner_id,
        referrer_id: user.id,
        status: "tracked",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (referralError) {
      console.error("Referral tracking error:", referralError)
      return NextResponse.json(
        { error: "Failed to track referral" },
        { status: 500 }
      )
    }

    // Update GHL contact with referral information
    if (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) {
      try {
        const ghlResponse = await fetch(
          `https://rest.gohighlevel.com/v1/contacts/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.GHL_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: lead_email,
              name: lead_name,
              locationId: process.env.GHL_LOCATION_ID,
              customFields: [
                {
                  key: "referral_code",
                  value: referral_code
                },
                {
                  key: "referrer_id",
                  value: user.id
                },
                {
                  key: "partner_id",
                  value: partner_id || ""
                },
                {
                  key: "source",
                  value: "SaintSal™ Referral"
                }
              ],
              tags: ["SaintSal-Referral", "Hot-Lead"]
            })
          }
        )

        if (ghlResponse.ok) {
          const ghlData = await ghlResponse.json()

          // Update referral with GHL contact ID
          await supabase
            .from("referrals")
            .update({ ghl_contact_id: ghlData.contact?.id })
            .eq("id", referral.id)
        }
      } catch (ghlError) {
        console.error("GHL integration error:", ghlError)
        // Don't fail the referral tracking if GHL fails
      }
    }

    return NextResponse.json({
      success: true,
      data: referral,
      message: "🔥 Referral tracked successfully!"
    })
  } catch (error) {
    console.error("Referral tracking error:", error)
    return NextResponse.json(
      { error: "Failed to track referral" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const url = new URL(req.url)
    const partner_id = url.searchParams.get("partner_id")

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("referrals")
      .select("*")
      .eq("referrer_id", user.id)
      .order("created_at", { ascending: false })

    if (partner_id) {
      query = query.eq("partner_id", partner_id)
    }

    const { data: referrals, error } = await query

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch referrals" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: referrals
    })
  } catch (error) {
    console.error("Fetch referrals error:", error)
    return NextResponse.json(
      { error: "Failed to fetch referrals" },
      { status: 500 }
    )
  }
}
