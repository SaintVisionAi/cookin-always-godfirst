'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

export default function FileUploader() {
  const [tags, setTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setSuccess(false);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tags', tags.join(','));

      const res = await fetch('/api/brain/ingest', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        console.log('Ingest success:', result);
        setSuccess(true);
      } else {
        console.error('Ingest failed:', result.error);
      }
    }

    setUploading(false);
  }, [tags]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      setTags((prev) => [...prev, e.currentTarget.value.trim()]);
      e.currentTarget.value = '';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl shadow-xl border border-gray-200">
      <h2 className="text-xl font-bold mb-4">📂 Upload to SaintSal Brain</h2>
      <div
        {...getRootProps()}
        className={clsx(
          'border-dashed border-2 p-8 rounded-md cursor-pointer transition-all',
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        )}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500 font-semibold">Drop it like it's divine 🔥</p>
        ) : (
          <p className="text-gray-500">Drag and drop files here, or click to select.</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Tags (press Enter to add)</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onKeyDown={handleTagAdd}
          placeholder="e.g. finance, ai, legal"
        />
        <div className="flex flex-wrap mt-2 gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {uploading && (
        <p className="mt-4 text-sm text-blue-600 animate-pulse">Uploading and syncing with the Mind...</p>
      )}

      {success && (
        <p className="mt-4 text-sm text-green-600">✅ Synced into SaintSal’s brain</p>
      )}
    </div>
  );
}
