'use client';

import { useState } from 'react';

export default function MemoryAwareAssistant({ userId }: { userId: string }) {
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const askAssistant = async () => {
    setLoading(true);
    const res = await fetch('/api/gpt/memory-aware', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, userQuery: query }),
    });
    const data = await res.json();
    setReply(data.reply || 'No reply received.');
    setLoading(false);
  };

  return (
    <div className="bg-white border p-4 rounded shadow mt-8 max-w-xl">
      <h2 className="text-xl font-semibold mb-2">🧠 Memory-Aware GPT Assistant</h2>

      <input
        type="text"
        className="w-full border px-3 py-2 rounded mb-2"
        placeholder="Ask something..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={askAssistant}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        disabled={loading || !query}
      >
        {loading ? 'Thinking...' : 'Ask GPT'}
      </button>

      {reply && (
        <p className="mt-4 bg-gray-100 p-3 rounded text-sm text-gray-800">
          🧠 <strong>GPT:</strong> {reply}
        </p>
      )}
    </div>
  );
}
