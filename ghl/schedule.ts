import { NextResponse } from 'next/server';
import { logCrmEvent } from '@/lib/logCrmEvent';

export async function POST(req: Request) {
  try {
    const appointmentPayload = await req.json();

    // Replace with actual GHL API call to book appointment
    const bookingResponse = {
      success: true,
      confirmation: 'Booked successfully',
    };

    await logCrmEvent({
      description: '📅 GHL Appointment Booked',
      context: {
        appointmentPayload,
        bookingResponse,
      },
      user_id: null,
    });

    return NextResponse.json({ success: true, booked: true });
  } catch (err) {
    console.error('❌ Schedule API Error:', err);
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
