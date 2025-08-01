'use client';

import { useState } from 'react';

export default function ReferralEngine() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const sendReferral = async () => {
    const res = await fetch('/api/referral/log', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setStatus('Referral sent successfully!');
      setEmail('');
    } else {
      setStatus('Failed to send referral.');
    }
  };

  return (
    <div className="bg-white p-4 border rounded shadow-sm mb-6">
      <h2 className="text-lg font-bold mb-2">📨 Invite a Partner</h2>
      <div className="flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={sendReferral}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send Invite
        </button>
      </div>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
