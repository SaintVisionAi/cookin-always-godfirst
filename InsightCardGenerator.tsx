'use client';

import { useState } from 'react';

type Insight = {
  title: string;
  summary: string;
  source: string;
  tags: string[];
  aiSummary?: string;
};

export default function InsightCardGenerator() {
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const res = await fetch('/api/institute/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setInsights(data);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">📈 Generate Insight Cards</h2>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. investment strategy 2025"
          className="flex-grow border border-gray-300 px-4 py-2 rounded"
        />
        <button
          onClick={fetchInsights}
          disabled={loading || !query.trim()}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? 'Thinking...' : 'Generate'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, idx) => (
          <div key={idx} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
            <p className="text-sm text-gray-700 mb-2">{insight.summary}</p>

            {/* ✅ AI Summary Bubble */}
            {insight.aiSummary && (
              <p className="text-xs italic text-purple-700 mt-2">
                🤖 AI Summary: {insight.aiSummary}
              </p>
            )}

            <div className="text-xs text-gray-500 mt-3 mb-1">Source: {insight.source}</div>
            <div className="flex gap-2 flex-wrap">
              {insight.tags.map((tag, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
