import { NextResponse } from 'next/server';
import { logCrmEvent } from '@/lib/logCrmEvent';

/**
 * Handles incoming GHL webhook events
 * Logs the event, then triggers business logic
 */
export async function POST(req: Request) {
  try {
    const event = await req.json();
    const { type: eventType, payload } = event;

    console.log('📡 GHL Webhook Triggered:', eventType, payload);

    // ✅ Centralized CRM log
    await logCrmEvent({
      description: `📡 GHL Webhook Received: ${eventType}`,
      context: payload,
    });

    // 🔧 Insert conditional logic here to handle the webhook:
    // e.g. if (eventType === 'lead.created') { ... }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ GHL Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
