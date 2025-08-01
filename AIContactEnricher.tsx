'use client';

import { useState } from 'react';

export default function AIContactEnricher({ contact }: { contact: any }) {
  const [enrichment, setEnrichment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const enrichContact = async () => {
    setLoading(true);
    const res = await fetch('/api/ai/enrich-contact', {
      method: 'POST',
      body: JSON.stringify({ contact }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setEnrichment(data);
    setLoading(false);
  };

  return (
    <div className="border rounded p-4 bg-white mt-4">
      <h2 className="text-sm font-semibold mb-2">🤖 AI Contact Enrichment</h2>
      <button
        onClick={enrichContact}
        disabled={loading}
        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        {loading ? 'Enriching...' : 'Enrich Contact'}
      </button>
      {enrichment && (
        <div className="mt-3 text-sm text-gray-800">
          <p><strong>Persona:</strong> {enrichment.persona}</p>
          <p><strong>Priority:</strong> {enrichment.priority}</p>
          <p className="mt-1 italic text-gray-500">🧠 Summary: {enrichment.reasoning}</p>
        </div>
      )}
    </div>
  );
}
