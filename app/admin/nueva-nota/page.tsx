'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import Autonota from '@/components/admin/Autonota';
import { CATEGORIAS } from '@/lib/types';

type FormData = {
  titulo: string; bajada: string; cuerpo: string; imagen_url: string;
  autor: string; fecha: string; categoria: string; video_url: string; destacado: boolean;
};

const EMPTY: FormData = {
  titulo: '', bajada: '', cuerpo: '', imagen_url: '', autor: '',
  fecha: new Date().toISOString().split('T')[0],
  categoria: 'actualidad', video_url: '', destacado: false,
};

export default function NuevaNotaPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [preview, setPreview] = useState(false);
  const router = useRouter();

  function set(key: keyof FormData, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function onAutonota(data: { titulo: string; bajada: string; cuerpo: string }) {
    setForm(f => ({ ...f, titulo: data.titulo, bajada: data.bajada, cuerpo: data.cuerpo }));
    setPreview(false);
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
      setTimeout(() => router.push('/admin/notas'), 1500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-tinta">Nueva nota</h1>
          <button onClick={() => setPreview(!preview)} className="text-sm border border-azul text-azul px-4 py-2 rounded hover:bg-azul hover:text-white transition-colors">
            {preview ? '← Editar' : '👁 Vista previa'}
          </button>
        </div>

        {status === 'ok' && <Alert type="ok">✓ Nota publicada. Redirigiendo...</Alert>}
        {status === 'error' && <Alert type="error">✗ Error al publicar. Intentá de nuevo.</Alert>}

        {preview ? (
          <PreviewPanel form={form} />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Autonota */}
            <Autonota onGenerar={onAutonota} />

            <Card title="Título *">
              <input type="text" value={form.titulo} onChange={e => set('titulo', e.target.value)}
                placeholder="Escribí el título..." required
                className="w-full text-xl font-display border-0 border-b-2 border-gris-claro focus:border-azul outline-none py-2 bg-transparent placeholder:text-gris-medio transition-colors" />
              <p className="text-xs text-gris-medio mt-1">{form.titulo.length}/120</p>
            </Card>

            <Card title="Bajada">
              <textarea value={form.bajada} onChange={e => set('bajada', e.target.value)}
                placeholder="Resumen breve de la nota..." rows={2}
                className="w-full border-2 border-gris-claro rounded px-3 py-2 focus:border-azul outline-none resize-none text-sm transition-colors" />
            </Card>

            <Card title="Cuerpo *">
              <textarea value={form.cuerpo} onChange={e => set('cuerpo', e.target.value)}
                placeholder="Texto completo de la nota..." rows={14} required
                className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none resize-y text-sm transition-colors font-mono leading-relaxed" />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card title="Categoría">
                <select value={form.categoria} onChange={e => set('categoria', e.target.value)}
                  className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors">
                  {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Card>
              <Card title="Autor">
                <input type="text" value={form.autor} onChange={e => set('autor', e.target.value)}
                  placeholder="Redacción Ñande Stream"
                  className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors" />
              </Card>
              <Card title="Fecha">
                <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} required
                  className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors" />
              </Card>
              <Card title="Destacar en portada">
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <div onClick={() => set('destacado', !form.destacado)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${form.destacado ? 'bg-rojo' : 'bg-gris-medio'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.destacado ? 'left-7' : 'left-1'}`} />
                  </div>
                  <span className="text-sm">{form.destacado ? '★ Aparece en portada' : '☆ Solo en la sección'}</span>
                </label>
              </Card>
            </div>

            <Card title="Imagen destacada">
              <ImageUploader value={form.imagen_url} onChange={url => set('imagen_url', url)} />
            </Card>

            <Card title="Video YouTube (opcional)">
              <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors" />
            </Card>

            <div className="flex gap-4 justify-end pt-2">
              <button type="button" onClick={() => setForm(EMPTY)}
                className="px-6 py-3 border-2 border-gris-claro text-gris-medio rounded hover:border-tinta hover:text-tinta transition-colors text-sm">
                Limpiar
              </button>
              <button type="submit" disabled={status === 'loading' || !form.titulo.trim()}
                className="px-8 py-3 bg-rojo hover:bg-rojo-oscuro text-white font-bold rounded transition-colors disabled:opacity-50 text-sm">
                {status === 'loading' ? 'Publicando...' : '✓ Publicar nota'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
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

function Alert({ type, children }: { type: 'ok'|'error'; children: React.ReactNode }) {
  return (
    <div className={`px-5 py-3 rounded mb-5 text-sm font-medium ${type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
      {children}
    </div>
  );
}

function PreviewPanel({ form }: { form: FormData }) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm max-w-2xl">
      <span className="inline-block bg-rojo text-white text-[0.6rem] uppercase tracking-widest font-bold px-3 py-1 rounded-sm mb-3">{form.categoria}</span>
      <h1 className="font-display text-3xl leading-tight mb-3">{form.titulo || 'Título'}</h1>
      {form.bajada && <p className="text-gray-500 text-lg mb-4 border-l-4 border-rojo pl-4">{form.bajada}</p>}
      <div className="text-sm text-gris-medio mb-6">{form.autor || 'Redacción'} · {form.fecha}</div>
      {form.imagen_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={form.imagen_url} alt="" className="rounded w-full object-cover mb-6 max-h-64" />
      )}
      <div className="prose-nota text-sm whitespace-pre-line">{form.cuerpo || 'Cuerpo...'}</div>
    </div>
  );
}
