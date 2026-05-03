'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditarNotaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<FormData | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/nota?id=${id}`)
      .then(r => r.json())
      .then(data => setForm(data));
  }, [id]);

  function set(key: keyof FormData, value: string | boolean) {
    setForm(f => f ? { ...f, [key]: value } : f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setStatus('loading');
    const res = await fetch('/api/admin/editar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...form }),
    });
    if (res.ok) {
      setStatus('ok');
      setTimeout(() => router.push('/admin/notas'), 1500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  async function handleDelete() {
    if (!confirm('¿Seguro que querés eliminar esta nota? Esta acción no se puede deshacer.')) return;
    setDeleting(true);
    const res = await fetch('/api/admin/eliminar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      router.push('/admin/notas');
    } else {
      setDeleting(false);
      alert('Error al eliminar');
    }
  }

  if (!form) return (
    <div className="min-h-screen bg-gris-claro flex items-center justify-center">
      <p className="text-gris-medio">Cargando nota...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gris-claro">
      <div className="bg-azul text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rojo rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
          </div>
          <span className="font-display font-bold">Ñande Stream</span>
          <span className="text-white/40 text-sm">/ Editar nota</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/notas')} className="text-white/60 text-sm hover:text-white transition-colors">
            ← Volver
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-white/10 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition-colors disabled:opacity-50"
          >
            {deleting ? 'Eliminando...' : 'Eliminar nota'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-display text-2xl text-tinta mb-8">Editar nota</h1>

        {status === 'ok' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded mb-6 text-sm font-medium">
            ✓ Nota actualizada correctamente. Redirigiendo...
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded mb-6 text-sm font-medium">
            ✗ Error al guardar. Intentá de nuevo.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Card title="Título *">
            <input
              type="text"
              value={form.titulo}
              onChange={e => set('titulo', e.target.value)}
              className="w-full text-xl font-display border-0 border-b-2 border-gris-claro focus:border-azul outline-none py-2 bg-transparent transition-colors"
              required
            />
          </Card>

          <Card title="Bajada">
            <textarea
              value={form.bajada}
              onChange={e => set('bajada', e.target.value)}
              rows={2}
              className="w-full border-2 border-gris-claro rounded px-3 py-2 focus:border-azul outline-none resize-none text-sm transition-colors"
            />
          </Card>

          <Card title="Cuerpo *">
            <textarea
              value={form.cuerpo}
              onChange={e => set('cuerpo', e.target.value)}
              rows={14}
              className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none resize-y text-sm transition-colors font-mono leading-relaxed"
              required
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Categoría">
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
                className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors"
              />
            </Card>

            <Card title="Fecha">
              <input
                type="date"
                value={form.fecha}
                onChange={e => set('fecha', e.target.value)}
                className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors"
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

          <Card title="Imagen (URL)">
            <input
              type="url"
              value={form.imagen_url}
              onChange={e => set('imagen_url', e.target.value)}
              className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors"
            />
            {form.imagen_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.imagen_url} alt="" className="mt-3 rounded h-28 object-cover w-full" onError={e => (e.currentTarget.style.display='none')} />
            )}
          </Card>

          <Card title="Video YouTube (opcional)">
            <input
              type="url"
              value={form.video_url}
              onChange={e => set('video_url', e.target.value)}
              className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors"
            />
          </Card>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => router.push('/admin/notas')}
              className="px-6 py-3 border-2 border-gris-claro text-gris-medio rounded hover:border-tinta hover:text-tinta transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3 bg-azul hover:bg-azul-claro text-white font-bold rounded transition-colors disabled:opacity-50 text-sm"
            >
              {status === 'loading' ? 'Guardando...' : '✓ Guardar cambios'}
            </button>
          </div>
        </form>
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
