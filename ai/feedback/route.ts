import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  const prompt = `This is user feedback or raw notes:\n"${input}"\nSummarize into 1 actionable product or engineering task.`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  const suggestion = chat.choices[0].message.content?.trim();
  return NextResponse.json({ suggestion });
}
