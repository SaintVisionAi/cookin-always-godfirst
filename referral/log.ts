import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { referralCode, userId, action } = await req.json();

  // 🔗 Referral code processing logic
  // TODO: Apply referral to user session/account

  await supabase.from('crm_logs').insert([
    {
      description: '🔗 Referral Code Used',
      context: { referralCode, userId, action },
    },
  ]);

  return NextResponse.json({ success: true });
}
