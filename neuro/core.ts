// 📦 app/api/neuro/core.ts — NeuroPsych Master Protocol
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { ageGroup, symptoms, history, cognitiveScores, environment } = await req.json()

  if (!ageGroup || !symptoms || !history) {
    return NextResponse.json({ error: "Missing neuro profile data" }, { status: 400 })
  }

  try {
    const report = {
      diagnosis: "Pending",
      interventions: [],
      specialist: "",
      urgency: "low"
    }

    const flags = []
    const symptomsText = symptoms.join(" ").toLowerCase()

    if (ageGroup === "elder" && symptomsText.includes("memory")) {
      report.diagnosis = "Early Cognitive Decline — possible Alzheimer's"
      report.interventions.push("MRI scan", "Neuropsych eval", "B12 blood panel", "Daily memory routine")
      report.specialist = "Neurologist"
      report.urgency = "high"
      flags.push("🔬 Long-term tracking recommended")
    }

    if (ageGroup === "child") {
      if (symptomsText.includes("attention") || symptomsText.includes("focus")) {
        report.diagnosis = "ADHD Spectrum — preliminary"
        report.interventions.push("Classroom observation", "Parent behavior journal", "Sleep & diet protocol")
        report.specialist = "Pediatric Psychologist"
      } else if (symptomsText.includes("aggression")) {
        report.diagnosis = "Emotional Dysregulation — needs assessment"
        report.interventions.push("Family therapy", "Anger journal", "School environment eval")
        report.specialist = "Child Behavioral Therapist"
      }
    }

    if (ageGroup === "adult" && symptomsText.includes("anxiety")) {
      report.diagnosis = "Generalized Anxiety Disorder — probable"
      report.interventions.push("CBT", "Breathwork training", "EMDR if trauma-linked")
      report.specialist = "Licensed Clinical Psychologist"
    }

    return NextResponse.json({
      ...report,
      flags,
      message: `NeuroPsych evaluation completed for ${ageGroup}`
    })
  } catch (err) {
    console.error("❌ Neuro protocol error:", err)
    return NextResponse.json({ error: "NeuroPsych evaluation failed" }, { status: 500 })
  }
}
