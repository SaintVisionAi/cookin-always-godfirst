'use client';

import FileUploader from '@/components/FileUploader';
import InsightCardGenerator from '@/components/InsightCardGenerator';

export default function WarRoom() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">🧠 Upload to SaintSal&apos;s Brain</h1>
      <FileUploader />

      <div className="mt-12">
        <InsightCardGenerator />
      </div>
    </main>
  );
}
