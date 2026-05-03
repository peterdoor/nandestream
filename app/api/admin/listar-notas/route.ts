import { NextRequest, NextResponse } from 'next/server';
import { getNotas } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const notas = await getNotas();
  return NextResponse.json(notas);
}
