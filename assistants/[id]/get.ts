import { NextResponse } from 'next/server';
import { getAssistant } from '@/app/agents/agent';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const assistant = await getAssistant(params.id);
  if (!assistant) {
    return NextResponse.json({ error: 'Assistant not found' }, { status: 404 });
  }

  return NextResponse.json(assistant);
}
