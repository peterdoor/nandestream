'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { CATEGORIAS } from '@/lib/types';

type FormData = {
  titulo: string; bajada: string; cuerpo: string; imagen_url: string;
  autor: string; fecha: string; categoria: string; video_url: string; destacado: boolean;
};

export default function EditarNotaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<FormData | null>(null);
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/nota?id=${id}`)
      .then(r => r.json())
      .then(d => setForm(d));
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
    if (!confirm('¿Eliminar esta nota? No se puede deshacer.')) return;
    setDeleting(true);
    const res = await fetch('/api/admin/eliminar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) router.push('/admin/notas');
    else { setDeleting(false); alert('Error al eliminar'); }
  }

  if (!form) return (
    <AdminLayout>
      <div className="flex items-center justify-center py-20 text-gris-medio">Cargando nota...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl text-tinta">Editar nota</h1>
          <button onClick={handleDelete} disabled={deleting}
            className="text-sm text-red-500 border border-red-200 hover:bg-red-500 hover:text-white px-4 py-2 rounded transition-colors disabled:opacity-50">
            {deleting ? 'Eliminando...' : 'Eliminar nota'}
          </button>
        </div>

        {status === 'ok' && <Alert type="ok">✓ Nota actualizada. Redirigiendo...</Alert>}
        {status === 'error' && <Alert type="error">✗ Error al guardar. Intentá de nuevo.</Alert>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Card title="Título *">
            <input type="text" value={form.titulo} onChange={e => set('titulo', e.target.value)} required
              className="w-full text-xl font-display border-0 border-b-2 border-gris-claro focus:border-azul outline-none py-2 bg-transparent transition-colors" />
          </Card>

          <Card title="Bajada">
            <textarea value={form.bajada} onChange={e => set('bajada', e.target.value)} rows={2}
              className="w-full border-2 border-gris-claro rounded px-3 py-2 focus:border-azul outline-none resize-none text-sm transition-colors" />
          </Card>

          <Card title="Cuerpo *">
            <textarea value={form.cuerpo} onChange={e => set('cuerpo', e.target.value)} rows={14} required
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
                className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors" />
            </Card>
            <Card title="Fecha">
              <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)}
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

          <Card title="Imagen (URL)">
            <input type="url" value={form.imagen_url} onChange={e => set('imagen_url', e.target.value)}
              placeholder="https://..." className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors" />
            {form.imagen_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.imagen_url} alt="" className="mt-3 rounded h-28 object-cover w-full" onError={e => (e.currentTarget.style.display='none')} />
            )}
          </Card>

          <Card title="Video YouTube (opcional)">
            <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors" />
          </Card>

          <div className="flex gap-4 justify-end pt-2">
            <button type="button" onClick={() => router.push('/admin/notas')}
              className="px-6 py-3 border-2 border-gris-claro text-gris-medio rounded hover:border-tinta hover:text-tinta transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={status === 'loading'}
              className="px-8 py-3 bg-azul hover:bg-azul-claro text-white font-bold rounded transition-colors disabled:opacity-50 text-sm">
              {status === 'loading' ? 'Guardando...' : '✓ Guardar cambios'}
            </button>
          </div>
        </form>
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
