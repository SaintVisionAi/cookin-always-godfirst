'use client';

import { useState } from 'react';

export default function ExportSummaryButton({
  title,
  summary,
  metadata,
}: {
  title: string;
  summary: string;
  metadata: Record<string, any>;
}) {
  const [loading, setLoading] = useState(false);

  const exportPDF = async () => {
    setLoading(true);
    const res = await fetch('/api/pdf/export-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, summary, metadata }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    link.click();
    setLoading(false);
  };

  return (
    <button
      onClick={exportPDF}
      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'Exporting…' : '📄 Export Summary as PDF'}
    </button>
  );
}
