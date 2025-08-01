import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createSummary } from '@/lib/openai';
import { logCrmEvent } from '@/lib/logging';

export async function POST(req: Request) {
  const json = await req.json();
  const { text, user_id } = json;

  const session = await getServerSession(authOptions);
  const userId = user_id || session?.user?.id;

  if (!userId || !text) {
    return new Response('Missing required fields', { status: 400 });
  }

  const summary = await createSummary(text);

  await logCrmEvent({
    description: '🧠 Summary Generated via GPT',
    context: { summary, text },
    user_id: userId,
  });

  return new Response(JSON.stringify({ summary }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
