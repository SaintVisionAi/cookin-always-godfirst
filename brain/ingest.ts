import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { filename, size, mimeType } = await req.json();

  // 🧠 Handle file ingestion & vector sync
  // TODO: Push to vector DB

  await supabase.from('crm_logs').insert([
    {
      description: '🧠 File Ingested into Brain',
      context: { filename, size, mimeType },
    },
  ]);

  return NextResponse.json({ success: true });
}
