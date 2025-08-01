import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(req: Request) {
  const { title, summary, metadata } = await req.json();

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    const heading = title || '📄 AI Summary Export';
    const body = summary || 'No summary provided.';

    page.drawText(heading, {
      x: 50,
      y: height - 60,
      size: 20,
      font,
      color: rgb(0.2, 0.2, 0.8),
    });

    const lines = body.match(/.{1,100}/g) || [];
    lines.forEach((line, i) => {
      page.drawText(line, {
        x: 50,
        y: height - 100 - i * 18,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    });

    if (metadata) {
      const metaText = JSON.stringify(metadata, null, 2);
      const metaLines = metaText.split('\n');
      metaLines.forEach((line, i) => {
        page.drawText(line, {
          x: 50,
          y: height - 150 - lines.length * 18 - i * 14,
          size: 10,
          font,
          color: rgb(0.4, 0.4, 0.4),
        });
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="summary.pdf"',
      },
    });
  } catch (err) {
    console.error('❌ PDF EXPORT ERROR', err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
