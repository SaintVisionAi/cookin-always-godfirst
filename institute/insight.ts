import { NextResponse } from 'next/server';
import { logCrmEvent } from '@/lib/logCrmEvent';
import { createClient } from '@supabase/supabase-js';
import { openai } from '@/lib/openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { source, content } = await req.json();

  const aiSummary = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: `Summarize: ${content}` }],
  });

  const insight = {
    summary: content,
    aiSummary: aiSummary.choices?.[0]?.message?.content ?? 'No summary generated.',
    source,
  };

  await logCrmEvent({
    description: '📈 Insight Generated from Document',
    context: insight,
  });

  return NextResponse.json(insight);
}
