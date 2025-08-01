import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('crm_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[CRM TIMELINE FETCH ERROR]', error);
    return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 });
  }

  return NextResponse.json({ logs: data });
}
