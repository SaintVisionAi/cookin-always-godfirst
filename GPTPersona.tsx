import { openai } from '@/lib/openai';

export async function detectPersona(summary: string) {
  const prompt = `Based on this lead summary, assign a persona: Founder, Investor, Skeptic, or Influencer.\n\n"${summary}"\n\nReturn only one label.`;

  const res = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4o'
  });

  return res.choices[0]?.message?.content?.trim() || '';
}
