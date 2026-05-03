import { Nota, Categoria } from './types';
import { slugify } from './utils';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY  = process.env.GOOGLE_API_KEY!;
const RANGE    = 'notas!A2:I';

function rowToNota(row: string[], index: number): Nota {
  const titulo = row[0] ?? '';
  return {
    id:         String(index + 2), // fila en el sheet
    titulo,
    bajada:     row[1] ?? '',
    cuerpo:     row[2] ?? '',
    imagen_url: row[3] ?? '',
    autor:      row[4] ?? 'Redacción Ñande Stream',
    fecha:      row[5] ?? '',
    categoria:  (row[6]?.toLowerCase() ?? 'actualidad') as Categoria,
    video_url:  row[7] ?? '',
    destacado:  row[8]?.toUpperCase() === 'SI',
    slug:       slugify(titulo),
  };
}

export async function getNotas(): Promise<Nota[]> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res  = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);
    const json = await res.json();
    const rows: string[][] = json.values ?? [];
    return rows
      .filter(row => row[0]) // ignorar filas vacías
      .map((row, i) => rowToNota(row, i))
      .reverse(); // más recientes primero
  } catch (e) {
    console.error('Error fetching notas:', e);
    return [];
  }
}

export async function getNotaBySlug(slug: string): Promise<Nota | null> {
  const notas = await getNotas();
  return notas.find(n => n.slug === slug) ?? null;
}

export async function getNotasByCategoria(categoria: Categoria): Promise<Nota[]> {
  const notas = await getNotas();
  return notas.filter(n => n.categoria === categoria);
}

export async function getNotasDestacadas(limit = 5): Promise<Nota[]> {
  const notas = await getNotas();
  return notas.filter(n => n.destacado).slice(0, limit);
}

export async function getNotasRecientes(limit = 10): Promise<Nota[]> {
  const notas = await getNotas();
  return notas.slice(0, limit);
}

// ─── Escritura (para el portal admin) ────────────────────────────────────────
// Usa la Service Account o OAuth. Para simplificar usamos un API Route
// que recibe los datos y los escribe via fetch a la Sheets API v4.
export async function appendNota(nota: Omit<Nota, 'id' | 'slug'>): Promise<boolean> {
  const WRITE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/notas!A:I:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
  const values = [[
    nota.titulo,
    nota.bajada,
    nota.cuerpo,
    nota.imagen_url,
    nota.autor,
    nota.fecha,
    nota.categoria,
    nota.video_url,
    nota.destacado ? 'SI' : 'NO',
  ]];
  try {
    const res = await fetch(WRITE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
