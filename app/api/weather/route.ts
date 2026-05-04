import { NextResponse } from 'next/server';

const CIUDADES = [
  { nombre: 'Asunción',        lat: -25.2867, lon: -57.6470 },
  { nombre: 'Encarnación',     lat: -27.3306, lon: -55.8659 },
  { nombre: 'Ciudad del Este', lat: -25.5167, lon: -54.6167 },
];

const ICONOS: Record<number, string> = {
  0: '☀️', 1: '🌤', 2: '⛅', 3: '☁️',
  45: '🌫', 48: '🌫',
  51: '🌦', 53: '🌦', 55: '🌧',
  61: '🌧', 63: '🌧', 65: '🌧',
  71: '🌨', 73: '🌨', 75: '🌨',
  80: '🌦', 81: '🌧', 82: '⛈',
  95: '⛈', 96: '⛈', 99: '⛈',
};

export async function GET() {
  try {
    const resultados = await Promise.all(
      CIUDADES.map(async (ciudad) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${ciudad.lat}&longitude=${ciudad.lon}&current=temperature_2m,weathercode&timezone=America%2FAsuncion`;
        const res = await fetch(url, { next: { revalidate: 1800 } });
        const data = await res.json();
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weathercode;
        const icono = ICONOS[code] ?? '🌡';
        return { ciudad: ciudad.nombre, temp, icono };
      })
    );
    return NextResponse.json(resultados);
  } catch (e) {
    console.error('Weather error:', e);
    return NextResponse.json([]);
  }
}
