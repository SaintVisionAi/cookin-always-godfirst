import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const {
      frustrationScore,
      tier,
      tone,
      escalationTrigger,
      overrideModel,
      isProUser,
    } = await req.json()

    // Determine model to escalate to
    let model = 'gpt-4o' // default
    if (overrideModel) {
      model = overrideModel
    } else if (frustrationScore > 7 || tone === 'angry' || escalationTrigger === true) {
      model = 'claude-3-opus'
    }

    const escalationPath = {
      escalate: true,
      model,
      notifyAdmin: isProUser || frustrationScore > 8,
      explanation: `Escalated due to ${
        overrideModel
          ? 'manual override'
          : frustrationScore > 7
          ? 'frustration score'
          : tone === 'angry'
          ? 'tone trigger'
          : 'PRO user priority'
      }`,
    }

    return NextResponse.json(escalationPath)
  } catch (err) {
    console.error('Escalation error:', err)
    return NextResponse.json({ error: 'Escalation failed' }, { status: 500 })
  }
}
