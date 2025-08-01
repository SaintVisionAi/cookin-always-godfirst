'use client';

import { useState } from 'react';

export default function AIFeedbackBot({ insightId }: { insightId: string }) {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ insightId, feedback }),
      headers: { 'Content-Type': 'application/json' },
    });
    setFeedback('');
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="text-sm font-semibold mb-2">💬 AI Feedback</h2>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Let us know what you think..."
        className="w-full p-2 text-sm border rounded"
      />
      <button
        onClick={handleSubmit}
        className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
      >
        Submit
      </button>
    </div>
  );
}
