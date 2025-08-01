'use client';

import { useState } from 'react';

export default function NotionSyncButton({ insight }: { insight: any }) {
  const [synced, setSynced] = useState(false);

  const syncToNotion = async () => {
    await fetch('/api/notion/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ insight }),
    });
    setSynced(true);
  };

  return (
    <div className="mt-2">
      <button
        onClick={syncToNotion}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        🧠 Sync to Notion
      </button>
      {synced && <p className="text-sm text-green-700 mt-1">✅ Synced to Notion!</p>}
    </div>
  );
}
