import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const contactPayload = await req.json();

  // 🧠 Create contact logic goes here
  // TODO: Call GHL API to create contact with contactPayload

  await supabase.from('crm_logs').insert([
    {
      description: '🧠 Contact Created via GHL API',
      context: { contactPayload },
    },
  ]);

  return NextResponse.json({ success: true });
}
