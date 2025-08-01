'use client';

import { useCallback, useState } from 'react';

export default function StickyUploadBar() {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags.join(','));

    const res = await fetch('/api/brain/ingest', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert('Upload failed');
    }

    setUploading(false);
    setFile(null);
  }, [file, tags]);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow z-50 flex items-center gap-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border px-2 py-1 rounded"
      />
      <input
        type="text"
        placeholder="tags (comma separated)"
        onChange={(e) => setTags(e.target.value.split(','))}
        className="border px-2 py-1 rounded flex-grow"
      />
      <button
        disabled={!file || uploading}
        onClick={upload}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
