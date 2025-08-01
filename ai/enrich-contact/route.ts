import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { contact } = await req.json();

  const prompt = \`You're a CRM expert. Based on this contact's data:\\n\${JSON.stringify(contact, null, 2)}\\nGenerate a concise persona like "Enterprise CTO", "Solo Founder", or "High-Spending Agency Buyer".\`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  const persona = chat.choices[0].message.content?.trim();
  return NextResponse.json({ persona });
}
