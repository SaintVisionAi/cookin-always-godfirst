import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { user_id, key, value } = await req.json();

  const { error } = await supabase.from('agent_context').upsert([
    { user_id, key, value }
  ]);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');

  const { data, error } = await supabase
    .from('agent_context')
    .select('*')
    .eq('user_id', user_id);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ context: data });
}
