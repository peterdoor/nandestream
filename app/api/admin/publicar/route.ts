import { NextRequest, NextResponse } from 'next/server';
import { slugify } from '@/lib/utils';

export async function POST(req: NextRequest) {
  // Verificar sesión
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const { titulo, bajada, cuerpo, imagen_url, autor, fecha, categoria, video_url, destacado } = body;

  if (!titulo || !cuerpo) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
  const API_KEY  = process.env.GOOGLE_API_KEY!;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/notas!A:I:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

  const values = [[
    titulo.trim(),
    bajada?.trim() ?? '',
    cuerpo.trim(),
    imagen_url?.trim() ?? '',
    autor?.trim() || 'Redacción Ñande Stream',
    fecha || new Date().toISOString().split('T')[0],
    categoria || 'actualidad',
    video_url?.trim() ?? '',
    destacado ? 'SI' : 'NO',
  ]];

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Sheets error:', err);
      return NextResponse.json({ error: 'Error al escribir en Sheets' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, slug: slugify(titulo) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error de red' }, { status: 500 });
  }
}
