import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function GET(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Falta ID' }, { status: 400 });

  const res = await fetch(`${SUPABASE_URL}/rest/v1/notas?id=eq.${id}&limit=1`, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });
  const rows = await res.json();
  if (!rows[0]) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });

  const n = rows[0];
  return NextResponse.json({
    titulo:           n.titulo ?? '',
    bajada:           n.bajada ?? '',
    cuerpo:           n.cuerpo ?? '',
    imagen_url:       n.imagen_url ?? '',
    autor:            n.autor ?? '',
    fecha:            n.fecha ?? '',
    categoria:        n.categoria ?? 'actualidad',
    video_url:        n.video_url ?? '',
    destacado:        Boolean(n.destacado),
    estado:           n.estado ?? 'publicado',
    seo_title:        n.seo_title ?? '',
    meta_description: n.meta_description ?? '',
    tags:             n.tags ?? '',
    slug:             n.slug ?? '',
  });
}
