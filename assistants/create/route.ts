import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { indexAssistantTraits } from '@/app/agents/agent';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { name, traits = [], owner_id, tier = 'FREE' } = body;

  const id = uuidv4();
  const created_at = new Date().toISOString();

  const { error } = await supabase.from('assistants').insert([
    { id, name, traits, owner_id, tier, created_at, updated_at: created_at }
  ]);

  if (error) {
    console.error('Assistant creation failed:', error);
    return NextResponse.json({ error: 'Failed to create assistant' }, { status: 500 });
  }

  await indexAssistantTraits({ id, name, traits, owner_id, tier, created_at, updated_at: created_at });

  return NextResponse.json({ id, name, traits, owner_id, tier, created_at });
}
