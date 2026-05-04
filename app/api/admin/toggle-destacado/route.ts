import { NextRequest, NextResponse } from 'next/server';
import { editarNota, getNotasDestacadas } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id, destacado } = await req.json();

  // Si quiere destacar, verificar que no haya más de 3
  if (destacado) {
    const actuales = await getNotasDestacadas(10);
    if (actuales.length >= 3 && !actuales.find(n => n.id === id)) {
      return NextResponse.json({
        error: 'Ya hay 3 notas destacadas en portada. Quitá una antes de agregar otra.',
        limite: true,
      }, { status: 400 });
    }
  }

  const ok = await editarNota(id, { destacado });
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
}
