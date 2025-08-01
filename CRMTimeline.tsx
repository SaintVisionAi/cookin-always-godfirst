'use client';

import { useEffect, useState } from 'react';
import CRMTimelineFilter from './CRMTimelineFilter';

export default function CRMTimeline() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch('/api/crm/timeline');
      const { logs } = await res.json();
      setLogs(logs);
    }

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'All') return true;
    return log.description?.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📜 CRM + AI Timeline</h2>
      <CRMTimelineFilter onChange={setFilter} />
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredLogs.map((log, idx) => (
          <div
            key={idx}
            className="border p-3 rounded bg-gray-50 text-sm shadow-sm"
          >
            <div className="font-medium">{log.description}</div>
            <div className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
