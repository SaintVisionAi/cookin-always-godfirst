
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ExportSummaryButton from '@/components/ExportSummaryButton';
import InsightChartButton from '@/components/InsightChartButton';

export default function InsightDetailPage() {
  const { id } = useParams();
  const [insight, setInsight] = useState<any>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      const res = await fetch(`/api/institute/insight/${id}`);
      const data = await res.json();
      setInsight(data.insight);
    };

    if (id) fetchInsight();
  }, [id]);

  if (!insight) return <p className="p-6">Loading insight...</p>;

  return (
    <main className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">🧠 Insight Detail</h1>

      <p className="text-lg font-medium mb-2">{insight.title}</p>
      <p className="text-gray-700 mb-4">{insight.summary}</p>

      {insight.aiSummary && (
        <p className="text-xs italic text-purple-700 mb-4">
          🤖 AI Summary: {insight.aiSummary}
        </p>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <ExportSummaryButton
          title={`Insight Summary – ${insight.title}`}
          summary={insight.summary}
          metadata={insight.metadata}
        />
        <InsightChartButton />
      </div>
    </main>
  );
}
