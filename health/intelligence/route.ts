// 📦 app/api/health/intelligence/route.ts — Health Intelligence Engine (SaintSal x Athena)
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { age, gender, symptoms, vitals, history, insurance, medications } = await req.json()

  if (!age || !symptoms || !vitals) {
    return NextResponse.json({ error: "Missing health input" }, { status: 400 })
  }

  try {
    const alerts = []
    const advisory = []
    const flags = []

    if (vitals.bloodPressure?.systolic > 140) alerts.push("⚠️ High blood pressure")
    if (vitals.heartRate > 100) alerts.push("⚠️ Elevated heart rate")
    if (symptoms.includes("chest pain") && age > 40) alerts.push("🚨 Cardiac Risk — Seek ER")
    if (vitals.temperature > 100.4) alerts.push("⚠️ Possible Fever — Monitor")

    // Medication cross-check
    if (medications?.includes("ibuprofen") && history?.includes("gastritis")) {
      advisory.push("Avoid ibuprofen due to gastric history")
    }

    // Insurance validation
    if (!insurance?.provider) {
      advisory.push("No insurance provider detected — recommend financial counselor referral")
    }

    // Preventative screening flags
    if (age > 50 && !history?.includes("colonoscopy")) {
      flags.push("📌 Schedule colon cancer screening")
    }

    if (gender === "female" && age > 40 && !history?.includes("mammogram")) {
      flags.push("📌 Mammogram recommended")
    }

    const summary = {
      baseline: `${age} y/o ${gender} with ${symptoms.length} symptoms`,
      alerts,
      advisory,
      flags,
      recommendation:
        alerts.includes("🚨 Cardiac Risk — Seek ER")
          ? "Immediate ER Referral"
          : alerts.length > 0
            ? "Primary Care Follow-up Needed"
            : "Routine Monitoring Advised"
    }

    return NextResponse.json({ status: "✅ Health Profile Assessed", ...summary })
  } catch (err) {
    console.error("❌ Health engine error:", err)
    return NextResponse.json({ error: "Health intelligence failed" }, { status: 500 })
  }
}
