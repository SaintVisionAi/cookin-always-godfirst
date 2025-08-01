import { NextResponse } from 'next/server';
import { updateAssistant } from '@/app/agents/agent';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const updates = await req.json();
  const updated = await updateAssistant(params.id, updates);

  if (!updated) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  return NextResponse.json(updated);
}
