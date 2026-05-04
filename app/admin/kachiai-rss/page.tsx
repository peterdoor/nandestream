'use client';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type RssItem = {
  titulo: string; bajada: string; url_original: string;
  imagen_url: string; fecha: string; fuente: string;
};

export default function KachiaiRssPage() {
  const [feedUrls, setFeedUrls] = useState('');
  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<RssItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<Record<string,string> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function fetchRSS() {
    const urls = feedUrls.split('\n').map(u => u.trim()).filter(Boolean);
    if (!urls.length) { setError('Ingresá al menos una URL de feed RSS'); return; }
    setLoading(true); setError(''); setItems([]);
    try {
      const res = await fetch('/api/admin/rss-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      if (!data.items?.length) setError('No se encontraron noticias. Verificá las URLs.');
      else setItems(data.items);
    } catch { setError('Error de conexión'); }
    finally { setLoading(false); }
  }

  async function generarNota(item: RssItem) {
    setSelected(item); setGenerating(true); setGeneratedNote(null);
    try {
      const res = await fetch('/api/admin/autonota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema: item.titulo, datos: item.bajada, categoria: 'kachiai' }),
      });
      const data = await res.json();
      if (data.cuerpo) setGeneratedNote({ ...data, imagen_url: item.imagen_url || '' });
      else setError(data.error || 'Error al generar');
    } catch { setError('Error de conexión'); }
    finally { setGenerating(false); }
  }

  async function guardarBorrador() {
    if (!generatedNote) return;
    setSaving(true);
    const res = await fetch('/api/admin/publicar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...generatedNote,
        categoria: 'kachiai',
        estado: 'borrador',
        destacado: true,
        autor: 'Redacción Ñande Stream',
        fecha: new Date().toISOString().split('T')[0],
      }),
    });
    if (res.ok) {
      setSaved(true); setGeneratedNote(null); setSelected(null);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="font-display text-xl text-tinta mb-2">RSS Kachiai</h1>
        <p className="text-sm text-gris-medio mb-6">
          Pegá URLs de feeds RSS de cultura, entretenimiento, chisme o humor. Groq reformula en tono Kachiai paraguayo.
        </p>

        {saved && <Alert type="ok">Borrador guardado. Revisalo en Notas.</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <div className="bg-white rounded-lg p-4 shadow-sm mb-5">
          <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">
            URLs de feeds RSS (una por línea)
          </label>
          <textarea
            value={feedUrls}
            onChange={e => { setFeedUrls(e.target.value); setError(''); }}
            rows={4}
            placeholder={"https://www.ejemplo.com/rss/entretenimiento.xml\nhttps://www.otro.com/feed/cultura"}
            className="w-full border border-gris-claro rounded px-3 py-2 text-sm font-mono focus:border-azul outline-none resize-none bg-white"
          />
          <button onClick={fetchRSS} disabled={loading}
            className="mt-3 w-full bg-rojo hover:bg-rojo-oscuro text-white font-bold py-2.5 rounded text-sm disabled:opacity-50 transition-colors">
            {loading ? 'Cargando feeds...' : 'Cargar noticias'}
          </button>
        </div>

        {items.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-5">
            <div className="px-4 py-3 border-b border-gris-claro">
              <p className="text-sm font-semibold text-tinta">{items.length} noticias encontradas</p>
            </div>
            {items.map((item, i) => (
              <div key={i} className="newsroom-row px-4 py-3.5 grid gap-3" style={{ gridTemplateColumns: '1fr auto' }}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-tinta line-clamp-2 mb-1">{item.titulo}</p>
                  {item.bajada && <p className="text-xs text-gris-medio line-clamp-1">{item.bajada}</p>}
                </div>
                <button onClick={() => generarNota(item)}
                  className="flex-shrink-0 text-xs font-semibold text-rojo border border-rojo/25 hover:bg-rojo hover:text-white px-3 py-2 rounded transition-colors">
                  Generar nota
                </button>
              </div>
            ))}
          </div>
        )}

        {generating && (
          <div className="bg-white rounded-lg p-8 text-center text-gris-medio text-sm shadow-sm">
            Generando nota en tono Kachiai...
          </div>
        )}

        {generatedNote && selected && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gris-claro border-b border-gris-claro">
              <p className="text-xs font-bold uppercase tracking-wider text-gris-medio">Borrador Kachiai — revisá antes de guardar</p>
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl text-tinta mb-2">{generatedNote.titulo}</h2>
              <p className="text-sm text-gray-500 mb-4 border-l-2 border-rojo pl-3">{generatedNote.bajada}</p>
              <div className="text-sm leading-relaxed whitespace-pre-line text-tinta mb-5">{generatedNote.cuerpo}</div>
              <p className="text-xs text-gris-medio mb-4">
                Fuente: <a href={selected.url_original} target="_blank" rel="noopener noreferrer" className="text-azul hover:underline">{selected.url_original}</a>
              </p>
              <div className="flex gap-3">
                <button onClick={() => { setGeneratedNote(null); setSelected(null); }}
                  className="px-4 py-2.5 border border-gris-claro text-gris-medio rounded text-sm hover:border-tinta transition-colors">
                  Descartar
                </button>
                <button onClick={guardarBorrador} disabled={saving}
                  className="flex-1 bg-rojo hover:bg-rojo-oscuro text-white font-bold py-2.5 rounded text-sm disabled:opacity-50 transition-colors">
                  {saving ? 'Guardando...' : 'Guardar como borrador'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Alert({ type, children }: { type: 'ok'|'error'; children: React.ReactNode }) {
  return (
    <div className={`px-4 py-3 rounded mb-4 text-sm font-medium ${type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
      {children}
    </div>
  );
}
