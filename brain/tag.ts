import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { logCrmEvent } from '@/lib/logging';

export async function POST(req: Request) {
  const json = await req.json();
  const { text, user_id } = json;

  const session = await getServerSession(authOptions);
  const userId = user_id || session?.user?.id;

  if (!userId || !text) {
    return new Response('Missing required fields', { status: 400 });
  }

  const prompt = `Analyze the following text and return 3-5 relevant tags and an urgency score from 1 to 10:\n\n${text}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  const tags = completion.choices[0]?.message?.content;

  await logCrmEvent({
    description: '🏷️ Tags Generated via GPT',
    context: { tags, text },
    user_id: userId,
  });

  return new Response(JSON.stringify({ tags }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
