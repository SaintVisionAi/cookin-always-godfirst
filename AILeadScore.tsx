import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAILeadScore(summary: string) {
  const prompt = `Rate this lead from 1 to 10 for sales potential:

"${summary}"

Give a score and a short reason.`;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });
    
    return response.choices[0]?.message?.content || 'Unable to score lead';
  } catch (error) {
    console.error('Error scoring lead:', error);
    return 'Error scoring lead';
  }
}
