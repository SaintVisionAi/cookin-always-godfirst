import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function logCrmEvent({
  description,
  context,
  user_id = null,
}: {
  description: string;
  context: Record<string, any>;
  user_id?: string | null;
}) {
  try {
    const { error } = await supabase.from('crm_logs').insert([
      {
        description,
        context,
        user_id,
      },
    ]);
    if (error) console.error('❌ CRM Event Log Error:', error);
  } catch (err) {
    console.error('❌ logCrmEvent Exception:', err);
  }
}
