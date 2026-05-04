import { NextRequest, NextResponse } from 'next/server';
import { eliminarNota } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Falta el ID' }, { status: 400 });
  const ok = await eliminarNota(id);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
}
