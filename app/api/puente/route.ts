import { NextResponse } from 'next/server';

const KEY = process.env.GOOGLE_DISTANCE_KEY!;
const POSADAS     = '-27.3669,-55.8960';
const ENCARNACION = '-27.3300,-55.8670';

async function getTiempo(origen: string, destino: string) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json`
    + `?origins=${encodeURIComponent(origen)}`
    + `&destinations=${encodeURIComponent(destino)}`
    + `&departure_time=now`
    + `&traffic_model=best_guess`
    + `&key=${KEY}`;

  const res = await fetch(url, {
    next: { revalidate: 7200 }, // cache 2 horas
  });

  const data = await res.json();
  const el = data?.rows?.[0]?.elements?.[0];

  if (!el || el.status !== 'OK') return null;

  const secs = el.duration_in_traffic?.value ?? el.duration?.value ?? 0;
  const mins = Math.round(secs / 60);

  const condicion =
    secs < 600  ? 'fluido' :
    secs < 1200 ? 'moderado' :
    'congestionado';

  const color =
    secs < 600  ? '#22c55e' :
    secs < 1200 ? '#f59e0b' :
    '#ef4444';

  return { mins, condicion, color };
}

export async function GET() {
  try {
    const [haciaPy, haciaMisiones] = await Promise.all([
      getTiempo(POSADAS, ENCARNACION),
      getTiempo(ENCARNACION, POSADAS),
    ]);

    return NextResponse.json({
      hacia_encarnacion: haciaPy,
      hacia_posadas: haciaMisiones,
    });
  } catch (e) {
    console.error('Puente API error:', e);
    return NextResponse.json({ error: 'Error al consultar el puente' }, { status: 500 });
  }
}
