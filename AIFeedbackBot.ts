'use client';

import { useState } from 'react';
import { logCrmEvent } from '@/utils/logCrmEvent';

export default function AIFeedbackBot({ feedback }: { feedback: string }) {
  const [response, setResponse] = useState('');

  async function handleSubmit() {
    const res = await fetch('/api/ai/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback }),
    });

    const data = await res.json();
    setResponse(data.suggestion || 'No actionable task returned');

    await logCrmEvent({
      description: '🗣 Feedback Submitted via AIFeedbackBot',
      context: { feedback, result: data.suggestion },
    });
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🧠 Process Feedback
      </button>
      {response && <p className="mt-2">📝 {response}</p>}
    </div>
  );
}
