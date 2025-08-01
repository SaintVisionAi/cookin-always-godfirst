import { NextRequest, NextResponse } from 'next/server';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

const width = 800;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

export async function POST(req: NextRequest) {
  const { insights } = await req.json();

  const configuration = {
    type: 'bar',
    data: {
      labels: insights.map((i: any) => i.label),
      datasets: [
        {
          label: 'Insight Score',
          data: insights.map((i: any) => i.score),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Insight Scores' },
      },
      scales: {
        y: { beginAtZero: true, max: 10 },
      },
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  return new NextResponse(image, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
