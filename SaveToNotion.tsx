'use client';

export default function SaveToNotion({ insight }: { insight: any }) {
  const save = async () => {
    await fetch('/api/insight/notion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(insight),
    });
    alert('Saved to Notion!');
  };

  return (
    <button onClick={save} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">
      Save to Notion
    </button>
  );
}
