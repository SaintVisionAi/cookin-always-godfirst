import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const json = await res.json();
    return NextResponse.json({ contacts: json.contacts || [] });
  } catch (err) {
    console.error('[GHL CONTACT FETCH ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
