import { NextRequest, NextResponse } from 'next/server';
import { crearNota } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const { titulo, bajada, cuerpo, imagen_url, autor, fecha, categoria, video_url, destacado } = body;

  if (!titulo?.trim() || !cuerpo?.trim()) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  const nota = await crearNota({
    titulo: titulo.trim(),
    bajada: bajada?.trim() ?? '',
    cuerpo: cuerpo.trim(),
    imagen_url: imagen_url?.trim() ?? '',
    autor: autor?.trim() || 'Redacción Ñande Stream',
    fecha: fecha || new Date().toISOString().split('T')[0],
    categoria: categoria || 'actualidad',
    video_url: video_url?.trim() ?? '',
    destacado: Boolean(destacado),
  });

  if (!nota) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug: nota.slug });
}
