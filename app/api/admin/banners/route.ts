import { NextRequest, NextResponse } from 'next/server';
import { getTodosBanners, saveBanner, crearBanner, eliminarBanner } from '@/lib/supabase';

function auth(req: NextRequest) {
  const s = req.cookies.get('admin_session');
  return s && s.value === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const banners = await getTodosBanners();
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const body = await req.json();
  const { action, id, ...data } = body;

  if (action === 'crear') {
    const ok = await crearBanner({ ...data, activo: true, posicion: data.posicion ?? 0 });
    return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Error' }, { status: 500 });
  }
  if (action === 'editar' && id) {
    const ok = await saveBanner(id, data);
    return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Error' }, { status: 500 });
  }
  if (action === 'eliminar' && id) {
    const ok = await eliminarBanner(id);
    return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Error' }, { status: 500 });
  }
  return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
}
