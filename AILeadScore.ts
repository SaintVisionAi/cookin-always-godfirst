import { openai } from '@/lib/openai';

export async function getAILeadScore(summary: string) {
  const prompt = `Rate this lead from 1 to 10 for sales potential:\n\n"${summary}"\n\nGive a score and a short reason.`;

  const res = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4o'
  });

  return res.choices[0]?.message?.content || '';
}
