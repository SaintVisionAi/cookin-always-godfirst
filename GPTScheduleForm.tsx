'use client';

import { useState } from 'react';

export default function GPTScheduleForm({ preset }: { preset?: any }) {
  const [form, setForm] = useState({
    name: preset?.name || '',
    email: preset?.email || '',
    calendarId: preset?.calendarId || '',
    startTime: preset?.startTime || '',
    endTime: preset?.endTime || '',
  });

  const fillWithGPT = async () => {
    const res = await fetch('/api/assist/gpt-fill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Schedule strategy call with John' }),
    });
    const data = await res.json();
    setForm(data.form); // Must return { name, email, calendarId, startTime, endTime }
  };

  const submit = async () => {
    const res = await fetch('/api/ghl/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    alert('📆 Appointment Booked ID: ' + result?.id);
  };

  return (
    <div className="p-4 border rounded shadow mt-6 bg-white">
      <h3 className="font-bold text-md mb-3">🧠 GPT Scheduler</h3>

      {Object.keys(form).map((field, i) => (
        <input
          key={i}
          placeholder={field}
          value={(form as any)[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className="w-full border p-2 rounded mb-2"
        />
      ))}

      <div className="flex gap-2">
        <button onClick={submit} className="bg-black text-white px-4 py-2 rounded">
          Book via AI
        </button>
        <button onClick={fillWithGPT} className="bg-gray-200 text-black px-4 py-2 rounded">
          Fill with GPT 🤖
        </button>
      </div>
    </div>
  );
}
