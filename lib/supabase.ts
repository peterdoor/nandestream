import { Nota, Categoria, EstadoNota } from './types';
import { slugify } from './utils';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

function hdrs(service = false) {
  const key = service ? SUPABASE_SERVICE_KEY : SUPABASE_ANON_KEY;
  return {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': `Bearer ${key}`,
  };
}

const BASE = `${SUPABASE_URL}/rest/v1/notas`;

function rowToNota(row: Record<string, unknown>): Nota {
  return {
    id:               String(row.id ?? ''),
    titulo:           String(row.titulo ?? ''),
    bajada:           String(row.bajada ?? ''),
    cuerpo:           String(row.cuerpo ?? ''),
    imagen_url:       String(row.imagen_url ?? ''),
    autor:            String(row.autor ?? 'Redacción Ñande Stream'),
    fecha:            String(row.fecha ?? ''),
    fecha_programada: row.fecha_programada ? String(row.fecha_programada) : undefined,
    categoria:        (row.categoria ?? 'actualidad') as Categoria,
    video_url:        String(row.video_url ?? ''),
    destacado:        Boolean(row.destacado),
    estado:           (row.estado ?? 'publicado') as EstadoNota,
    slug:             String(row.slug ?? ''),
    seo_title:        String(row.seo_title ?? ''),
    meta_description: String(row.meta_description ?? ''),
    tags:             String(row.tags ?? ''),
    orden_portada:    Number(row.orden_portada ?? 0),
    created_at:       row.created_at ? String(row.created_at) : undefined,
  };
}

// ─── LECTURA PÚBLICA ──────────────────────────────────────────────────────────

export async function getNotas(): Promise<Nota[]> {
  try {
    const res = await fetch(
      `${BASE}?estado=eq.publicado&order=created_at.desc`,
      { headers: hdrs(), next: { revalidate: 60 } }
    );
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map(rowToNota) : [];
  } catch { return []; }
}

export async function getNotaBySlug(slug: string): Promise<Nota | null> {
  try {
    const res = await fetch(
      `${BASE}?slug=eq.${encodeURIComponent(slug)}&estado=eq.publicado&limit=1`,
      { headers: hdrs(), next: { revalidate: 60 } }
    );
    const rows = await res.json();
    return rows[0] ? rowToNota(rows[0]) : null;
  } catch { return null; }
}

export async function getNotasByCategoria(categoria: Categoria): Promise<Nota[]> {
  try {
    const res = await fetch(
      `${BASE}?categoria=eq.${categoria}&estado=eq.publicado&order=created_at.desc`,
      { headers: hdrs(), next: { revalidate: 60 } }
    );
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map(rowToNota) : [];
  } catch { return []; }
}

export async function getNotasDestacadas(limit = 6): Promise<Nota[]> {
  try {
    const res = await fetch(
      `${BASE}?destacado=eq.true&estado=eq.publicado&order=orden_portada.asc,created_at.desc&limit=${limit}`,
      { headers: hdrs(), next: { revalidate: 60 } }
    );
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map(rowToNota) : [];
  } catch { return []; }
}

export async function getNotasRecientes(limit = 10): Promise<Nota[]> {
  try {
    const res = await fetch(
      `${BASE}?estado=eq.publicado&order=created_at.desc&limit=${limit}`,
      { headers: hdrs(), next: { revalidate: 60 } }
    );
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map(rowToNota) : [];
  } catch { return []; }
}

// ─── LECTURA ADMIN (todas) ────────────────────────────────────────────────────

export async function getTodasLasNotas(): Promise<Nota[]> {
  try {
    const res = await fetch(
      `${BASE}?order=created_at.desc`,
      { headers: hdrs(true), cache: 'no-store' }
    );
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map(rowToNota) : [];
  } catch { return []; }
}

// ─── ESCRITURA ────────────────────────────────────────────────────────────────

export async function crearNota(data: Omit<Nota, 'id' | 'slug' | 'created_at'>): Promise<Nota | null> {
  const slug = slugify(data.titulo);
  try {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { ...hdrs(true), 'Prefer': 'return=representation' },
      body: JSON.stringify({ ...data, slug }),
    });
    const rows = await res.json();
    return rows[0] ? rowToNota(rows[0]) : null;
  } catch { return null; }
}

export async function editarNota(id: string, data: Partial<Omit<Nota, 'id' | 'created_at'>>): Promise<boolean> {
  if (data.titulo) data.slug = slugify(data.titulo);
  try {
    const res = await fetch(`${BASE}?id=eq.${id}`, {
      method: 'PATCH',
      headers: { ...hdrs(true), 'Prefer': 'return=minimal' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch { return false; }
}

export async function eliminarNota(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}?id=eq.${id}`, {
      method: 'DELETE',
      headers: hdrs(true),
    });
    return res.ok;
  } catch { return false; }
}

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────

export type SiteConfig = {
  frase_hero: string;
  youtube_live_id: string;
  stream_activo: boolean;
  ticker_extra: string;
  ticker_velocidad: number;
  youtube_url: string;
  facebook_url: string;
  tiktok_url: string;
  instagram_url: string;
  whatsapp_url: string;
  agenda: string;
  programa_actual: string;
  rss_urls: string;
};

const DEFAULT_CONFIG: SiteConfig = {
  frase_hero: 'Información que construye el Paraguay',
  youtube_live_id: '',
  stream_activo: false,
  ticker_extra: '',
  ticker_velocidad: 25,
  youtube_url: '',
  facebook_url: '',
  tiktok_url: '',
  instagram_url: '',
  whatsapp_url: '',
  agenda: '',
  programa_actual: '',
  rss_urls: '',
};

const CONFIG_BASE = `${SUPABASE_URL}/rest/v1/config`;

export async function getConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch(`${CONFIG_BASE}?id=eq.1&limit=1`, {
      headers: hdrs(),
      next: { revalidate: 120 },
    });
    const rows = await res.json();
    return rows[0] ? { ...DEFAULT_CONFIG, ...rows[0] } : DEFAULT_CONFIG;
  } catch { return DEFAULT_CONFIG; }
}

export async function saveConfig(data: Partial<SiteConfig>): Promise<boolean> {
  try {
    const res = await fetch(`${CONFIG_BASE}?id=eq.1`, {
      method: 'PATCH',
      headers: { ...hdrs(true), 'Prefer': 'return=minimal' },
      body: JSON.stringify(data),
    });
    if (res.status === 406 || res.status === 404) {
      const ins = await fetch(CONFIG_BASE, {
        method: 'POST',
        headers: hdrs(true),
        body: JSON.stringify({ id: 1, ...DEFAULT_CONFIG, ...data }),
      });
      return ins.ok;
    }
    return res.ok;
  } catch { return false; }
}

// ─── RSS ──────────────────────────────────────────────────────────────────────

export type RssItem = {
  id: string;
  titulo: string;
  bajada: string;
  url_original: string;
  imagen_url: string;
  fecha_publicacion: string;
  procesado: boolean;
};

export async function getRssItems(): Promise<RssItem[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/rss_items?procesado=eq.false&order=created_at.desc&limit=30`,
      { headers: hdrs(true), cache: 'no-store' }
    );
    const rows = await res.json();
    return Array.isArray(rows) ? rows : [];
  } catch { return []; }
}

export async function marcarRssProcessado(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rss_items?id=eq.${id}`, {
      method: 'PATCH',
      headers: { ...hdrs(true), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ procesado: true }),
    });
    return res.ok;
  } catch { return false; }
}
