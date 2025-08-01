'use client';

import { useState } from 'react';
import { logCrmEvent } from '@/utils/logCrmEvent';

export default function AIContactEnricher({ contact }: { contact: any }) {
  const [enriched, setEnriched] = useState<any>(null);

  async function enrichContact() {
    const res = await fetch('/api/ai/enrich-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact }),
    });
    const data = await res.json();
    setEnriched(data.persona);

    await logCrmEvent({
      description: '🔍 Contact Enriched via GPT',
      context: { contactId: contact.id, result: data.persona },
    });
  }

  return (
    <div className="mt-4">
      <button
        onClick={enrichContact}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        ✨ Enrich with GPT
      </button>
      {enriched && (
        <p className="mt-2 text-sm italic text-gray-700">Persona: {enriched}</p>
      )}
    </div>
  );
}
