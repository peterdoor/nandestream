import { NextRequest, NextResponse } from 'next/server';
import { saveConfig } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const data = await req.json();
  const ok = await saveConfig(data);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
}
