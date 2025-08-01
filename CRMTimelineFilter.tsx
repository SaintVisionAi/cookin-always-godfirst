'use client';

import { useState } from 'react';

const SOURCES = ['All', 'Slack', 'GHL', 'GPT', 'User'];

export default function CRMTimelineFilter({ onChange }: { onChange: (src: string) => void }) {
  const [selected, setSelected] = useState('All');

  const select = (src: string) => {
    setSelected(src);
    onChange(src);
  };

  return (
    <div className="flex gap-3 mb-4">
      {SOURCES.map((src) => (
        <button
          key={src}
          className={`px-3 py-1 rounded border ${
            selected === src ? 'bg-purple-700 text-white' : 'bg-white'
          }`}
          onClick={() => select(src)}
        >
          {src}
        </button>
      ))}
    </div>
  );
}
