'use client';

import { useState } from 'react';

export default function ScheduleAssistant() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    calendarId: '',
    startTime: '',
    endTime: '',
  });

  const book = async () => {
    const res = await fetch('/api/ghl/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    alert('📅 Booked! ID: ' + result?.id);
  };

  return (
    <div className="bg-white border p-4 rounded shadow mt-10">
      <h3 className="text-md font-bold mb-2">📅 Schedule a Meeting</h3>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Calendar ID"
        value={form.calendarId}
        onChange={(e) => setForm({ ...form, calendarId: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Start Time (ISO)"
        value={form.startTime}
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="End Time (ISO)"
        value={form.endTime}
        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
      />
      <button
        onClick={book}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Book Appointment
      </button>
    </div>
  );
}
