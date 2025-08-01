'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactTable() {
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchContacts() {
      const { data, error } = await supabase.from('contacts').select('*');
      if (error) {
        console.error('Failed to load contacts:', error);
      } else {
        setContacts(data || []);
      }
    }
    fetchContacts();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">📇 Contacts</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Tags</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="p-2">{contact.name}</td>
              <td className="p-2">{contact.email}</td>
              <td className="p-2">{contact.phone}</td>
              <td className="p-2">{contact.tags?.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
