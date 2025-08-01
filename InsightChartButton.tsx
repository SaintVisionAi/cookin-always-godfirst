'use client';

import React from 'react';

export default function InsightChartButton() {
  const generateChart = async () => {
    const response = await fetch('/api/institute/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        insights: [
          { label: 'Jenny Smith', score: 9.3 },
          { label: 'David R.', score: 8.6 },
        ],
      }),
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={generateChart}
      className="bg-purple-600 text-white px-4 py-2 rounded mt-4 hover:bg-purple-700 transition"
    >
      📊 Generate Insight Chart
    </button>
  );
}
