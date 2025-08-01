'use client';

import { useEffect, useState } from 'react';

export default function AgentMemory({ userId }: { userId: string }) {
  const [memory, setMemory] = useState<any[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const fetchMemory = async () => {
    const res = await fetch(`/api/agent/context?user_id=${userId}`);
    const data = await res.json();
    setMemory(data.context || []);
  };

  const addMemory = async () => {
    await fetch('/api/agent/context', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, key: newKey, value: newValue }),
      headers: { 'Content-Type': 'application/json' },
    });
    setNewKey('');
    setNewValue('');
    fetchMemory();
  };

  const clearMemory = async () => {
    await fetch('/api/agent/context/clear', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchMemory();
  };

  useEffect(() => {
    fetchMemory();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-xl font-bold mb-2">🧠 Agent Memory</h2>

      <div className="mb-4">
        <input
          className="border px-2 py-1 mr-2"
          placeholder="Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <input
          className="border px-2 py-1 mr-2"
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <button
          onClick={addMemory}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          ➕ Add
        </button>
      </div>

      <button
        onClick={clearMemory}
        className="bg-red-500 text-white px-3 py-1 rounded mb-4"
      >
        🧹 Clear Memory
      </button>

      <ul className="space-y-2">
        {memory.map((item, i) => (
          <li key={i} className="bg-white p-2 rounded shadow text-sm">
            <strong>{item.key}</strong>: {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
