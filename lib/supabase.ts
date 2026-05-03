import { Nota, Categoria } from './types';
import { slugify } from './utils';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

function headers(useService = false) {
  return {
    'Content-Type': 'application/json',
    'apikey': useService ? SUPABASE_SERVICE_KEY : SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${useService ? SUPABASE_SERVICE_KEY : SUPABASE_ANON_KEY}`,
  };
}

const BASE = `${SUPABASE_URL}/rest/v1/notas`;

// ─── LECTURA ─────────────────────────────────────────────────────────────────

export async function getNotas(): Promise<Nota[]> {
  try {
    const res = await fetch(`${BASE}?order=created_at.desc`, {
      headers: headers(),
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
    const rows = await res.json();
    return rows.map(rowToNota);
  } catch (e) {
    console.error('Error fetching notas:', e);
    return [];
  }
}

export async function getNotaBySlug(slug: string): Promise<Nota | null> {
  try {
    const res = await fetch(`${BASE}?slug=eq.${encodeURIComponent(slug)}&limit=1`, {
      headers: headers(),
      next: { revalidate: 60 },
    });
    const rows = await res.json();
    return rows[0] ? rowToNota(rows[0]) : null;
  } catch {
    return null;
  }
}

export async function getNotasByCategoria(categoria: Categoria): Promise<Nota[]> {
  try {
    const res = await fetch(`${BASE}?categoria=eq.${categoria}&order=created_at.desc`, {
      headers: headers(),
      next: { revalidate: 60 },
    });
    const rows = await res.json();
    return rows.map(rowToNota);
  } catch {
    return [];
  }
}

export async function getNotasDestacadas(limit = 6): Promise<Nota[]> {
  try {
    const res = await fetch(`${BASE}?destacado=eq.true&order=created_at.desc&limit=${limit}`, {
      headers: headers(),
      next: { revalidate: 60 },
    });
    const rows = await res.json();
    return rows.map(rowToNota);
  } catch {
    return [];
  }
}

export async function getNotasRecientes(limit = 10): Promise<Nota[]> {
  try {
    const res = await fetch(`${BASE}?order=created_at.desc&limit=${limit}`, {
      headers: headers(),
      next: { revalidate: 60 },
    });
    const rows = await res.json();
    return rows.map(rowToNota);
  } catch {
    return [];
  }
}

// ─── ESCRITURA ────────────────────────────────────────────────────────────────

export async function crearNota(data: Omit<Nota, 'id' | 'slug'>): Promise<Nota | null> {
  const slug = slugify(data.titulo);
  const body = { ...data, slug };
  try {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { ...headers(true), 'Prefer': 'return=representation' },
      body: JSON.stringify(body),
    });
    const rows = await res.json();
    return rows[0] ? rowToNota(rows[0]) : null;
  } catch {
    return null;
  }
}

export async function editarNota(id: string, data: Partial<Omit<Nota, 'id'>>): Promise<boolean> {
  if (data.titulo) data.slug = slugify(data.titulo);
  try {
    const res = await fetch(`${BASE}?id=eq.${id}`, {
      method: 'PATCH',
      headers: { ...headers(true), 'Prefer': 'return=minimal' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function eliminarNota(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}?id=eq.${id}`, {
      method: 'DELETE',
      headers: headers(true),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function rowToNota(row: Record<string, unknown>): Nota {
  return {
    id:         String(row.id),
    titulo:     String(row.titulo ?? ''),
    bajada:     String(row.bajada ?? ''),
    cuerpo:     String(row.cuerpo ?? ''),
    imagen_url: String(row.imagen_url ?? ''),
    autor:      String(row.autor ?? 'Redacción Ñande Stream'),
    fecha:      String(row.fecha ?? ''),
    categoria:  (row.categoria ?? 'actualidad') as Categoria,
    video_url:  String(row.video_url ?? ''),
    destacado:  Boolean(row.destacado),
    slug:       String(row.slug ?? ''),
  };
}

// ─── CONFIGURACIÓN DEL SITIO ──────────────────────────────────────────────────

export type SiteConfig = {
  frase_hero: string;
  youtube_live_id: string;
  stream_activo: boolean;
  ticker_extra: string;
  youtube_url: string;
  facebook_url: string;
  tiktok_url: string;
  instagram_url: string;
  whatsapp_url: string;
};

const DEFAULT_CONFIG: SiteConfig = {
  frase_hero: 'Información que construye el Paraguay',
  youtube_live_id: '',
  stream_activo: false,
  ticker_extra: '',
  youtube_url: '',
  facebook_url: '',
  tiktok_url: '',
  instagram_url: '',
  whatsapp_url: '',
};

const CONFIG_BASE = `${process.env.SUPABASE_URL}/rest/v1/config`;

export async function getConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch(`${CONFIG_BASE}?id=eq.1&limit=1`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY!}`,
      },
      next: { revalidate: 60 },
    });
    const rows = await res.json();
    return rows[0] ?? DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(data: Partial<SiteConfig>): Promise<boolean> {
  try {
    // Upsert — inserta si no existe, actualiza si existe
    const res = await fetch(`${CONFIG_BASE}?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(data),
    });
    if (res.status === 404 || res.status === 406) {
      // No existe, insertar
      const ins = await fetch(CONFIG_BASE, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 1, ...DEFAULT_CONFIG, ...data }),
      });
      return ins.ok;
    }
    return res.ok;
  } catch {
    return false;
  }
}
