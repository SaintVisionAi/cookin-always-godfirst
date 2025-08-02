import { createClient } from '@supabase/supabase-js';
import { sendGHLMessage } from '@/lib/ghl';
import { logCrmEvent } from '@/lib/logs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function triggerOutreach(contact: any) {
  const { id, name, tags, score } = contact;

  if (score < 7) return;

  const message = `Hi ${name}, based on our last chat we’d love to help.`;

  const result = await sendGHLMessage(id, message);

  await logCrmEvent({
    description: '🚀 Outreach Triggered via GPT Playbook',
    context: { contact, result },
    user_id: contact.user_id
  });

  return result;
}
