'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIAS } from '@/lib/types';

type FormData = {
  titulo: string;
  bajada: string;
  cuerpo: string;
  imagen_url: string;
  autor: string;
  fecha: string;
  categoria: string;
  video_url: string;
  destacado: boolean;
};

const EMPTY: FormData = {
  titulo: '',
  bajada: '',
  cuerpo: '',
  imagen_url: '',
  autor: '',
  fecha: new Date().toISOString().split('T')[0],
  categoria: 'actualidad',
  video_url: '',
  destacado: false,
};

export default function NuevaNotaPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [preview, setPreview] = useState(false);
  const router = useRouter();

  function set(key: keyof FormData, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    setStatus('loading');

    const res = await fetch('/api/admin/publicar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus('ok');
      setForm(EMPTY);
      setTimeout(() => {
        setStatus('idle');
        router.push('/admin/notas');
      }, 1500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  return (
    <div className="min-h-screen bg-gris-claro">
      {/* Header admin */}
      <div className="bg-azul text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rojo rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
          </div>
          <span className="font-display font-bold">Ñande Stream</span>
          <span className="text-white/40 text-sm">/ Nueva nota</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/notas" className="text-white/70 hover:text-white text-sm transition-colors">
            Notas publicadas
          </Link>
          <Link href="/admin" className="text-white/70 hover:text-white text-sm transition-colors">
            Panel
          </Link>
          <a href="/" className="text-white/60 text-sm hover:text-white transition-colors">← Ver sitio</a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl text-tinta">Nueva nota</h1>
          <button
            onClick={() => setPreview(!preview)}
            className="text-sm border border-azul text-azul px-4 py-2 rounded hover:bg-azul hover:text-white transition-colors"
          >
            {preview ? 'Editar' : 'Vista previa'}
          </button>
        </div>

        {status === 'ok' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded mb-6 text-sm font-medium">
            ✓ Nota publicada correctamente. Redirigiendo...
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded mb-6 text-sm font-medium">
            ✗ Hubo un error al publicar. Verificá tu conexión e intentá de nuevo.
          </div>
        )}

        {preview ? (
          <PreviewPanel form={form} />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Card title="Título de la nota *">
              <input
                type="text"
                value={form.titulo}
                onChange={e => set('titulo', e.target.value)}
                placeholder="Escribí el título principal..."
                className="w-full text-xl font-display border-0 border-b-2 border-gris-claro focus:border-azul outline-none py-2 bg-transparent placeholder:text-gris-medio transition-colors"
                required
              />
              <p className="text-xs text-gris-medio mt-1">{form.titulo.length}/120 caracteres</p>
            </Card>

            <Card title="Bajada / Descripción breve">
              <textarea
                value={form.bajada}
                onChange={e => set('bajada', e.target.value)}
                placeholder="Resumen de 1-2 oraciones..."
                rows={2}
                className="w-full border-2 border-gris-claro rounded px-3 py-2 focus:border-azul outline-none resize-none placeholder:text-gris-medio text-sm transition-colors"
              />
            </Card>

            <Card title="Cuerpo de la nota *">
              <textarea
                value={form.cuerpo}
                onChange={e => set('cuerpo', e.target.value)}
                placeholder="Escribí o pegá el texto completo de la nota aquí..."
                rows={14}
                className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none resize-y placeholder:text-gris-medio text-sm transition-colors font-mono leading-relaxed"
                required
              />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Categoría *">
                <select
                  value={form.categoria}
                  onChange={e => set('categoria', e.target.value)}
                  className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors"
                >
                  {CATEGORIAS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </Card>

              <Card title="Autor">
                <input
                  type="text"
                  value={form.autor}
                  onChange={e => set('autor', e.target.value)}
                  placeholder="Redacción Ñande Stream"
                  className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors"
                />
              </Card>

              <Card title="Fecha de publicación *">
                <input
                  type="date"
                  value={form.fecha}
                  onChange={e => set('fecha', e.target.value)}
                  className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors"
                  required
                />
              </Card>

              <Card title="Destacado en portada">
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <div
                    onClick={() => set('destacado', !form.destacado)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.destacado ? 'bg-rojo' : 'bg-gris-medio'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.destacado ? 'left-7' : 'left-1'}`} />
                  </div>
                  <span className="text-sm font-medium">
                    {form.destacado ? 'Sí — aparece en portada' : 'No — solo en la sección'}
                  </span>
                </label>
              </Card>
            </div>

            <Card title="Imagen destacada">
              <input
                type="url"
                value={form.imagen_url}
                onChange={e => set('imagen_url', e.target.value)}
                placeholder="https://..."
                className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors"
              />
              {form.imagen_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imagen_url} alt="preview" className="mt-3 rounded h-28 object-cover w-full" onError={e => (e.currentTarget.style.display='none')} />
              )}
            </Card>

            <Card title="Video de YouTube (opcional)">
              <input
                type="url"
                value={form.video_url}
                onChange={e => set('video_url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors"
              />
            </Card>

            <div className="flex gap-4 justify-end pt-2">
              <button
                type="button"
                onClick={() => setForm(EMPTY)}
                className="px-6 py-3 border-2 border-gris-claro text-gris-medio rounded hover:border-tinta hover:text-tinta transition-colors text-sm font-medium"
              >
                Limpiar
              </button>
              <button
                type="submit"
                disabled={status === 'loading' || !form.titulo.trim()}
                className="px-8 py-3 bg-rojo hover:bg-rojo-oscuro text-white font-bold rounded transition-colors disabled:opacity-50 text-sm"
              >
                {status === 'loading' ? 'Publicando...' : '✓ Publicar nota'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <label className="block text-xs font-bold uppercase tracking-wider text-gris-medio mb-3">{title}</label>
      {children}
    </div>
  );
}

function PreviewPanel({ form }: { form: FormData }) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm max-w-2xl">
      <span className="inline-block bg-rojo text-white text-[0.6rem] uppercase tracking-widest font-bold px-3 py-1 rounded-sm mb-3">
        {form.categoria || 'categoría'}
      </span>
      <h1 className="font-display text-3xl leading-tight mb-3">{form.titulo || 'Título de la nota'}</h1>
      {form.bajada && <p className="text-gray-500 text-lg mb-4 border-l-4 border-rojo pl-4">{form.bajada}</p>}
      <div className="text-sm text-gris-medio mb-6">
        {form.autor || 'Redacción Ñande Stream'} · {form.fecha}
      </div>
      {form.imagen_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={form.imagen_url} alt="" className="rounded w-full object-cover mb-6 max-h-64" />
      )}
      <div className="prose-nota text-sm whitespace-pre-line">{form.cuerpo || 'El cuerpo de la nota aparecerá aquí...'}</div>
    </div>
  );
}
