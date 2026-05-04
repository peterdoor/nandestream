import { NextResponse } from 'next/server';
import { getConfig } from '@/lib/supabase';

export async function GET() {
  const config = await getConfig();
  return NextResponse.json({
    ticker_velocidad: config.ticker_velocidad,
    stream_activo: config.stream_activo,
    youtube_live_id: config.youtube_live_id,
    frase_hero: config.frase_hero,
    programa_actual: config.programa_actual,
    agenda: config.agenda,
  });
}
