'use client';
import { useState } from 'react';

type RssItem = {
  titulo: string; bajada: string; url_original: string;
  imagen_url: string; fecha: string; fuente: string;
};

type Props = {
  titulo: string;
  descripcion: string;
  categoria: string;
  colorBtn?: string;
  defaultFeeds?: string[];
};

export default function RssPage({ titulo, descripcion, categoria, colorBtn = 'bg-azul hover:bg-azul-claro', defaultFeeds = [] }: Props) {
  const [feedUrls, setFeedUrls] = useState(defaultFeeds.join('\n'));
  const [items, setItems] = useState<RssItem[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<RssItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<Record<string,string> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function fetchRSS() {
    const urls = feedUrls.split('\n').map(u => u.trim()).filter(Boolean);
    if (!urls.length) { setError('Ingresa al menos una URL de feed RSS'); return; }
    setLoading(true); setError(''); setItems([]);
    try {
      const res = await fetch('/api/admin/rss-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls, limit: 100 }),
      });
      const data = await res.json();
      if (!data.items?.length) setError('No se encontraron noticias. Verifica las URLs.');
      else setItems(data.items);
    } catch { setError('Error de conexion'); }
    finally { setLoading(false); }
  }

  async function generarNota(item: RssItem) {
    setSelected(item); setGenerating(true); setGeneratedNote(null);
    try {
      const res = await fetch('/api/admin/autonota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema: item.titulo, datos: item.bajada, categoria }),
      });
      const data = await res.json();
      if (data.cuerpo) setGeneratedNote({ ...data, imagen_url: item.imagen_url || '' });
      else setError(data.error || 'Error al generar');
    } catch { setError('Error de conexion'); }
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
        categoria,
        estado: 'borrador',
        destacado: true,
        autor: 'Redaccion Nande Stream',
        fecha: new Date().toISOString().split('T')[0],
      }),
    });
    if (res.ok) {
      setSaved(true); setGeneratedNote(null); setSelected(null);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  const filtrados = items.filter(i =>
    i.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-display text-xl text-tinta mb-1">RSS {titulo}</h1>
      <p className="text-sm text-gris-medio mb-6">{descripcion}</p>

      {saved && <Alert type="ok">Borrador guardado. Revisalo en Notas.</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <div className="bg-white rounded-lg p-4 shadow-sm mb-5">
        <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">
          URLs de feeds RSS (una por linea)
        </label>
        <textarea
          value={feedUrls}
          onChange={e => { setFeedUrls(e.target.value); setError(''); }}
          rows={Math.max(3, defaultFeeds.length + 1)}
          className="w-full border border-gris-claro rounded px-3 py-2 text-sm font-mono focus:border-azul outline-none resize-none bg-white"
        />
        <button onClick={fetchRSS} disabled={loading}
          className={`mt-3 w-full ${colorBtn} text-white font-bold py-2.5 rounded text-sm disabled:opacity-50 transition-colors`}>
          {loading ? 'Cargando feeds...' : 'Cargar noticias'}
        </button>
      </div>

      {items.length > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <input type="text" placeholder="Filtrar resultados..." value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="flex-1 border border-gris-claro rounded px-3 py-2 text-sm focus:border-azul outline-none bg-white" />
          <span className="text-xs text-gris-medio whitespace-nowrap">{filtrados.length} de {items.length}</span>
        </div>
      )}

      {filtrados.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-5">
          {filtrados.map((item, i) => (
            <div key={i} className="px-4 py-3 grid gap-3 border-b border-gris-claro last:border-0"
              style={{ gridTemplateColumns: '1fr auto' }}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-tinta line-clamp-2 mb-0.5">{item.titulo}</p>
                {item.bajada && <p className="text-xs text-gris-medio line-clamp-1">{item.bajada}</p>}
                {item.fecha && <p className="text-[0.6rem] text-gris-medio mt-0.5">{new Date(item.fecha).toLocaleDateString('es-AR')}</p>}
              </div>
              <button onClick={() => generarNota(item)}
                className={`flex-shrink-0 text-xs font-semibold text-white ${colorBtn} px-3 py-2 rounded transition-colors`}>
                Generar
              </button>
            </div>
          ))}
        </div>
      )}

      {generating && (
        <div className="bg-white rounded-lg p-8 text-center text-gris-medio text-sm shadow-sm">
          Generando nota con IA...
        </div>
      )}

      {generatedNote && selected && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gris-claro border-b border-gris-claro">
            <p className="text-xs font-bold uppercase tracking-wider text-gris-medio">Borrador — revisa antes de guardar</p>
          </div>
          <div className="p-5">
            <h2 className="font-display text-xl text-tinta mb-2">{generatedNote.titulo}</h2>
            <p className="text-sm text-gray-500 mb-4 border-l-2 border-rojo pl-3">{generatedNote.bajada}</p>
            <div className="text-sm leading-relaxed whitespace-pre-line text-tinta mb-5 max-h-64 overflow-y-auto">
              {generatedNote.cuerpo}
            </div>
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
  );
}

function Alert({ type, children }: { type: 'ok'|'error'; children: React.ReactNode }) {
  return (
    <div className={`px-4 py-3 rounded mb-4 text-sm font-medium ${type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
      {children}
    </div>
  );
}
