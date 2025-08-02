'use client';

import React from 'react';

import { useState } from 'react';

export default function AIContactEnricher({ contact }: { contact: any }) {
  const [enriched, setEnriched] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const enrichContact = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/enrich-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact })
      });
      
      const data = await response.json();
      setEnriched(data);
      
      // TODO: Log CRM event
      console.log('Contact enriched:', data);
    } catch (error) {
      console.error('Error enriching contact:', error);
    }
    setLoading(false);
  };

  return (
    <div className="ai-contact-enricher">
      <h3>AI Contact Enricher</h3>
      <button onClick={enrichContact} disabled={loading}>
        {loading ? 'Enriching...' : 'Enrich Contact'}
      </button>
      {enriched && (
        <div className="enriched-data">
          <pre>{JSON.stringify(enriched, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
