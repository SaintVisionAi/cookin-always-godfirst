'use client';

import { useState } from 'react';
import { logCrmEvent } from '@/utils/logCrmEvent';

export default function SlackBroadcastBot({ insight }: { insight: any }) {
  const [sent, setSent] = useState(false);

  const postToSlack = async () => {
    await fetch('/api/slack/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ insight }),
    });

    setSent(true);

    await logCrmEvent({
      description: '📢 Insight Broadcasted to Slack',
      context: { title: insight.title, score: insight.metadata?.score },
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={postToSlack}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        📢 Post to Slack
      </button>
      {sent && <p className="text-sm text-green-700 mt-1">Sent!</p>}
    </div>
  );
}
