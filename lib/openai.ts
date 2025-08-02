import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function createSummary(content: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates concise summaries.'
        },
        {
          role: 'user',
          content: `Please summarize the following content: ${content}`
        }
      ],
      max_tokens: 200,
      temperature: 0.3
    })

    return completion.choices[0]?.message?.content || 'Summary generation failed'
  } catch (error) {
    console.error('Summary creation error:', error)
    return null
  }
}
