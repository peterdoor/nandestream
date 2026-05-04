'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import { CATEGORIAS, EstadoNota } from '@/lib/types';
import { slugify } from '@/lib/utils';

type FormData = {
  titulo: string; bajada: string; cuerpo: string; imagen_url: string;
  autor: string; fecha: string; categoria: string; video_url: string;
  destacado: boolean; estado: EstadoNota; seo_title: string;
  meta_description: string; tags: string; slug: string;
};

const EMPTY: FormData = {
  titulo: '', bajada: '', cuerpo: '', imagen_url: '', autor: '',
  fecha: new Date().toISOString().split('T')[0],
  categoria: 'actualidad', video_url: '', destacado: true,
  estado: 'publicado', seo_title: '', meta_description: '', tags: '', slug: '',
};

export default function NuevaNotaPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [tab, setTab] = useState<'contenido'|'seo'|'ia'>('contenido');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [evergreen, setEvergreen] = useState<string[]>([]);
  const [streamMode, setStreamMode] = useState(false);
  const [transcripcion, setTranscripcion] = useState('');
  const [streamTitulo, setStreamTitulo] = useState('');
  const [streamResult, setStreamResult] = useState<Record<string,string> | null>(null);
  const router = useRouter();

  function set(key: keyof FormData, value: string | boolean) {
    setForm(f => {
      const next = { ...f, [key]: value };
      if (key === 'titulo') next.slug = slugify(String(value));
      return next;
    });
  }

  async function generarIA() {
    if (!form.titulo.trim()) { setAiError('Escribí el título primero'); return; }
    setAiLoading(true); setAiError('');
    try {
      const res = await fetch('/api/admin/autonota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema: form.titulo, datos: form.bajada, categoria: form.categoria }),
      });
      const data = await res.json();
      if (data.cuerpo) {
        setForm(f => ({ ...f,
          bajada: data.bajada || f.bajada,
          cuerpo: data.cuerpo,
          seo_title: data.seo_title || '',
          meta_description: data.meta_description || '',
          tags: data.tags || '',
          estado: 'borrador',
        }));
        setTab('contenido');
      } else {
        setAiError(data.error || 'Error al generar');
      }
    } catch { setAiError('Error de conexión'); }
    finally { setAiLoading(false); }
  }

  async function cargarEvergreen() {
    setAiLoading(true);
    try {
      const res = await fetch('/api/admin/autonota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modo: 'evergreen', categoria: form.categoria, tema: '' }),
      });
      const data = await res.json();
      setEvergreen(data.sugerencias || []);
    } catch {}
    finally { setAiLoading(false); }
  }

  async function generarDesdeStream() {
    if (!transcripcion.trim()) return;
    setAiLoading(true); setAiError('');
    try {
      const res = await fetch('/api/admin/stream-nota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcripcion, titulo_stream: streamTitulo }),
      });
      const data = await res.json();
      if (data.titulo) {
        setStreamResult(data);
      } else {
        setAiError(data.error || 'Error al generar');
      }
    } catch { setAiError('Error de conexión'); }
    finally { setAiLoading(false); }
  }

  function usarResultadoStream() {
    if (!streamResult) return;
    setForm(f => ({
      ...f,
      titulo: streamResult.titulo || f.titulo,
      bajada: streamResult.bajada || f.bajada,
      cuerpo: streamResult.cuerpo || f.cuerpo,
      seo_title: streamResult.seo_title || '',
      meta_description: streamResult.meta_description || '',
      slug: slugify(streamResult.titulo || f.titulo),
      estado: 'borrador',
    }));
    setStreamMode(false);
    setStreamResult(null);
    setTab('contenido');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim() || !form.cuerpo.trim()) return;
    setStatus('loading');
    const res = await fetch('/api/admin/publicar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus('ok');
      setTimeout(() => router.push('/admin/notas'), 1200);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-xl text-tinta">Nueva nota</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setStreamMode(!streamMode)}
              className={`text-xs px-3 py-2 rounded border transition-colors ${streamMode ? 'bg-azul text-white border-azul' : 'border-gris-claro text-gris-medio hover:border-azul hover:text-azul'}`}>
              Desde stream
            </button>
            <select value={form.estado} onChange={e => set('estado', e.target.value as EstadoNota)}
              className="text-xs border border-gris-claro rounded px-3 py-2 bg-white focus:border-azul outline-none">
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicar ahora</option>
              <option value="programado">Programar</option>
            </select>
          </div>
        </div>

        {status === 'ok' && <Alert type="ok">Nota guardada. Redirigiendo...</Alert>}
        {status === 'error' && <Alert type="error">Error al guardar. Intentá de nuevo.</Alert>}

        {/* Módulo stream */}
        {streamMode && (
          <div className="bg-azul/5 border border-azul/20 rounded-lg p-5 mb-6">
            <h3 className="font-semibold text-tinta mb-4 text-sm">Generar nota desde stream</h3>
            <div className="flex flex-col gap-3">
              <input type="text" value={streamTitulo} onChange={e => setStreamTitulo(e.target.value)}
                placeholder="Título o tema del stream (opcional)"
                className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white" />
              <textarea value={transcripcion} onChange={e => setTranscripcion(e.target.value)}
                placeholder="Pegá la transcripción o resumen del stream aquí..." rows={6}
                className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white resize-y font-mono" />
              {aiError && <p className="text-xs text-red-500">{aiError}</p>}
              <button onClick={generarDesdeStream} disabled={aiLoading || !transcripcion.trim()}
                className="bg-azul hover:bg-azul-claro text-white font-semibold py-2.5 rounded text-sm disabled:opacity-50 transition-colors">
                {aiLoading ? 'Generando...' : 'Generar contenido'}
              </button>
            </div>

            {/* Resultado stream */}
            {streamResult && (
              <div className="mt-4 bg-white rounded-lg p-4 border border-gris-claro">
                <h4 className="font-semibold text-sm text-tinta mb-3">Contenido generado</h4>
                <p className="font-display text-base mb-2">{streamResult.titulo}</p>
                <p className="text-sm text-gray-500 mb-3">{streamResult.bajada}</p>
                {streamResult.post_facebook && (
                  <div className="bg-gris-claro rounded p-3 mb-2">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-1">Facebook</p>
                    <p className="text-xs">{streamResult.post_facebook}</p>
                  </div>
                )}
                {streamResult.mensaje_whatsapp && (
                  <div className="bg-green-50 rounded p-3 mb-3">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-1">WhatsApp</p>
                    <p className="text-xs">{streamResult.mensaje_whatsapp}</p>
                  </div>
                )}
                <button onClick={usarResultadoStream}
                  className="w-full bg-rojo hover:bg-rojo-oscuro text-white font-bold py-2 rounded text-sm transition-colors">
                  Usar este contenido como borrador
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gris-claro mb-5">
          {(['contenido', 'seo', 'ia'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-rojo text-rojo' : 'border-transparent text-gris-medio hover:text-tinta'}`}>
              {t === 'ia' ? 'IA / Evergreen' : t === 'seo' ? 'SEO' : 'Contenido'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* TAB CONTENIDO */}
          {tab === 'contenido' && (
            <>
              <Card title="Título *">
                <input type="text" value={form.titulo} onChange={e => set('titulo', e.target.value)}
                  placeholder="Título de la nota..." required
                  className="w-full text-xl font-display border-0 border-b-2 border-gris-claro focus:border-azul outline-none py-2 bg-transparent placeholder:text-gris-medio transition-colors" />
                <p className="text-xs text-gris-medio mt-1">{form.titulo.length}/90</p>
              </Card>

              <Card title="Bajada">
                <textarea value={form.bajada} onChange={e => set('bajada', e.target.value)}
                  placeholder="Resumen breve..." rows={2}
                  className="w-full border border-gris-claro rounded px-3 py-2 focus:border-azul outline-none resize-none text-sm transition-colors bg-white" />
              </Card>

              <Card title="Cuerpo *">
                <textarea value={form.cuerpo} onChange={e => set('cuerpo', e.target.value)}
                  placeholder="Texto completo de la nota..." rows={12} required
                  className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none resize-y text-sm transition-colors font-mono leading-relaxed bg-white" />
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card title="Categoría">
                  <select value={form.categoria} onChange={e => set('categoria', e.target.value)}
                    className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors">
                    {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </Card>
                <Card title="Autor">
                  <input type="text" value={form.autor} onChange={e => set('autor', e.target.value)}
                    placeholder="Redacción Ñande Stream"
                    className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors" />
                </Card>
                <Card title="Fecha">
                  <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)}
                    className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors" required />
                </Card>
                <Card title="En portada">
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <div onClick={() => set('destacado', !form.destacado)}
                      className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${form.destacado ? 'bg-azul' : 'bg-gris-medio'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.destacado ? 'left-7' : 'left-1'}`} />
                    </div>
                    <span className="text-sm text-tinta">{form.destacado ? 'En portada' : 'Solo en sección'}</span>
                  </label>
                </Card>
              </div>

              <Card title="Imagen destacada">
                <ImageUploader value={form.imagen_url} onChange={url => set('imagen_url', url)} />
              </Card>

              <Card title="Video YouTube (opcional)">
                <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors" />
              </Card>
            </>
          )}

          {/* TAB SEO */}
          {tab === 'seo' && (
            <>
              <Card title="Slug (URL)">
                <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)}
                  placeholder="url-de-la-nota"
                  className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm font-mono bg-white transition-colors" />
                <p className="text-xs text-gris-medio mt-1">nandestream.com/nota/{form.slug || 'url-de-la-nota'}</p>
              </Card>
              <Card title="SEO Title">
                <input type="text" value={form.seo_title} onChange={e => set('seo_title', e.target.value)}
                  placeholder={form.titulo || 'Título para buscadores'}
                  className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors" />
                <p className="text-xs text-gris-medio mt-1">{form.seo_title.length}/60 caracteres</p>
              </Card>
              <Card title="Meta description">
                <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
                  placeholder={form.bajada || 'Descripción para buscadores y redes'} rows={3}
                  className="w-full border border-gris-claro rounded px-3 py-2 focus:border-azul outline-none text-sm resize-none bg-white transition-colors" />
                <p className="text-xs text-gris-medio mt-1">{form.meta_description.length}/155 caracteres</p>
              </Card>
              <Card title="Tags">
                <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)}
                  placeholder="paraguay, política, congreso"
                  className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors" />
              </Card>
            </>
          )}

          {/* TAB IA */}
          {tab === 'ia' && (
            <div className="flex flex-col gap-4">
              {/* Autonota */}
              <Card title="Generar nota con IA">
                <p className="text-xs text-gris-medio mb-3">
                  Escribí el título y la IA genera bajada, cuerpo, SEO y tags. Queda como borrador para revisar.
                </p>
                {aiError && <p className="text-xs text-red-500 mb-2">{aiError}</p>}
                <button type="button" onClick={generarIA} disabled={aiLoading || !form.titulo.trim()}
                  className="w-full bg-azul hover:bg-azul-claro text-white font-bold py-3 rounded text-sm disabled:opacity-50 transition-colors">
                  {aiLoading ? 'Generando...' : 'Generar con IA'}
                </button>
                {!form.titulo.trim() && (
                  <p className="text-xs text-gris-medio mt-2 text-center">Escribí el título en la pestaña Contenido primero</p>
                )}
              </Card>

              {/* Evergreen */}
              <Card title="Temas Evergreen">
                <p className="text-xs text-gris-medio mb-3">
                  Sugerencias de temas atemporales para la categoría seleccionada.
                </p>
                <button type="button" onClick={cargarEvergreen} disabled={aiLoading}
                  className="w-full border border-azul text-azul hover:bg-azul hover:text-white font-semibold py-2.5 rounded text-sm disabled:opacity-50 transition-colors mb-3">
                  {aiLoading ? 'Cargando...' : 'Ver sugerencias evergreen'}
                </button>
                {evergreen.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {evergreen.map((tema, i) => (
                      <button key={i} type="button"
                        onClick={() => { set('titulo', tema); set('estado', 'borrador'); setTab('contenido'); }}
                        className="text-left text-sm px-3 py-2.5 bg-gris-claro hover:bg-azul hover:text-white rounded transition-colors">
                        {tema}
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Botones submit - siempre visibles */}
          <div className="flex gap-3 justify-end pt-2 pb-6">
            <button type="button" onClick={() => setForm(EMPTY)}
              className="px-5 py-3 border border-gris-claro text-gris-medio rounded hover:border-tinta hover:text-tinta transition-colors text-sm">
              Limpiar
            </button>
            <button type="submit" disabled={status === 'loading' || !form.titulo.trim() || !form.cuerpo.trim()}
              className="px-8 py-3 bg-rojo hover:bg-rojo-oscuro text-white font-bold rounded transition-colors disabled:opacity-50 text-sm">
              {status === 'loading' ? 'Guardando...' : form.estado === 'borrador' ? 'Guardar borrador' : 'Publicar nota'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2.5">{title}</label>
      {children}
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
