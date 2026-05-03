import { NextRequest, NextResponse } from 'next/server';
import { editarNota } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { id, destacado } = await req.json();
  const ok = await editarNota(id, { destacado });
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Error' }, { status: 500 });
}
