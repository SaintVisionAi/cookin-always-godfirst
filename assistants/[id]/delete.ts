import { NextResponse } from 'next/server';
import { deleteAssistant } from '@/app/agents/agent';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const success = await deleteAssistant(params.id);
  if (!success) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
