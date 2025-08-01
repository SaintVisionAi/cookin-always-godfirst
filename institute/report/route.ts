import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const { topic, points, tags = [] } = await req.json()

    const systemPrompt = `
You are SaintSal, co-founder of the Institute.
Create a strategic, faith-aligned brief for the topic: ${topic}
Include the following points: ${points?.join(', ')}.
Summarize clearly, and tag with: ${tags.join(', ')}.
Make it useful for leadership or client decision-making.
Include forward-looking perspective.
`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o',
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate brief for: ${topic}` },
        ],
      }),
    })

    const json = await res.json()
    const content = json.choices?.[0]?.message?.content?.trim()

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([612, 792])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 12

    const wrapped = content.match(/(.|[\r\n]){1,500}/g) || []
    let y = 750
    wrapped.forEach((chunk: string) => {
      page.drawText(chunk.trim(), { x: 50, y, size: fontSize, font })
      y -= 20
    })

    const tagsText = `Tags: ${tags.join(', ')}`
    page.drawText(tagsText, {
      x: 50,
      y: 50,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="saintvision-brief.pdf"`,
      },
    })
  } catch (err) {
    console.error('📉 Brief generation error:', err)
    return NextResponse.json({ error: 'Brief generation failed.' }, { status: 500 })
  }
}
