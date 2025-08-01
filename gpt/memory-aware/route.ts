import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { user_id, userQuery } = await req.json();

  // Step 1: Fetch memory context for this user
  const memoryRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agent/context?user_id=${user_id}`);
  const memoryData = await memoryRes.json();
  const memoryContext = memoryData.context?.map((entry: any) => `${entry.key}: ${entry.value}`).join('\n') || 'No prior memory.';

  // Step 2: Craft prompt using context
  const prompt = `You are a CRM assistant with memory.\n\nPrevious Memory:\n${memoryContext}\n\nNew User Input:\n${userQuery}\n\nRespond helpfully using memory if relevant.`;

  // Step 3: Call GPT
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a CRM assistant helping a user.' },
      { role: 'user', content: prompt },
    ],
  });

  const reply = chat.choices[0].message.content?.trim();
  return NextResponse.json({ reply });
}
