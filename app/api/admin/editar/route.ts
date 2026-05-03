import { NextRequest, NextResponse } from 'next/server';
import { editarNota } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'Falta el ID' }, { status: 400 });
  const ok = await editarNota(id, data);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: 'Error al editar' }, { status: 500 });
}
