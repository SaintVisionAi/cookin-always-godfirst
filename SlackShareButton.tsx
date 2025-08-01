'use client';

import { useState } from 'react';

export default function SlackShareButton({ insight }: { insight: any }) {
  const [sent, setSent] = useState(false);

  const postToSlack = async () => {
    await fetch('/api/slack/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ insight }),
    });
    setSent(true);
  };

  return (
    <div className="mt-2">
      <button
        onClick={postToSlack}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        📤 Share to Slack
      </button>
      {sent && <p className="text-sm text-blue-700 mt-1">✅ Sent to Slack!</p>}
    </div>
  );
}
