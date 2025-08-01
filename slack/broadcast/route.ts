import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { insight } = await req.json();

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: 'Missing SLACK_WEBHOOK_URL' }, { status: 500 });
  }

  const message = {
    text: \`🧠 *AI Insight Posted*\\n*\${insight.title}*\\nScore: \${insight.metadata?.score}\\nSummary: \${insight.summary}\`,
  };

  await fetch(webhook, {
    method: 'POST',
    body: JSON.stringify(message),
    headers: { 'Content-Type': 'application/json' },
  });

  return NextResponse.json({ success: true });
}
