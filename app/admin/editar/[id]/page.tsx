'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import { CATEGORIAS, ESTADOS, EstadoNota } from '@/lib/types';
import { slugify } from '@/lib/utils';

type FormData = {
  titulo: string; bajada: string; cuerpo: string; imagen_url: string;
  autor: string; fecha: string; categoria: string; video_url: string;
  destacado: boolean; estado: EstadoNota; seo_title: string;
  meta_description: string; tags: string; slug: string;
};

export default function EditarNotaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<FormData | null>(null);
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [deleting, setDeleting] = useState(false);
  const [tab, setTab] = useState<'contenido'|'seo'>('contenido');

  useEffect(() => {
    fetch(`/api/admin/nota?id=${id}`).then(r => r.json()).then(d => setForm({
      ...d,
      estado: d.estado || 'publicado',
      seo_title: d.seo_title || '',
      meta_description: d.meta_description || '',
      tags: d.tags || '',
      slug: d.slug || slugify(d.titulo || ''),
    }));
  }, [id]);

  function set(key: keyof FormData, value: string | boolean) {
    setForm(f => {
      if (!f) return f;
      const next = { ...f, [key]: value };
      if (key === 'titulo') next.slug = slugify(String(value));
      return next;
    });
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
    if (res.ok) { setStatus('ok'); setTimeout(() => router.push('/admin/notas'), 1200); }
    else { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar esta nota?')) return;
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
      <div className="flex items-center justify-center py-20 text-gris-medio text-sm">Cargando...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-xl text-tinta">Editar nota</h1>
          <div className="flex items-center gap-2">
            <select value={form.estado} onChange={e => set('estado', e.target.value as EstadoNota)}
              className="text-xs border border-gris-claro rounded px-3 py-2 bg-white focus:border-azul outline-none">
              {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
            <button onClick={handleDelete} disabled={deleting}
              className="text-xs text-red-400 border border-red-200 hover:bg-red-500 hover:text-white px-3 py-2 rounded transition-colors disabled:opacity-50">
              {deleting ? '...' : 'Eliminar'}
            </button>
          </div>
        </div>

        {status === 'ok' && <Alert type="ok">Guardado. Redirigiendo...</Alert>}
        {status === 'error' && <Alert type="error">Error al guardar.</Alert>}

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gris-claro mb-5">
          {(['contenido', 'seo'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-rojo text-rojo' : 'border-transparent text-gris-medio hover:text-tinta'}`}>
              {t === 'seo' ? 'SEO' : 'Contenido'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'contenido' && (
            <>
              <Card title="Título *">
                <input type="text" value={form.titulo} onChange={e => set('titulo', e.target.value)} required
                  className="w-full text-xl font-display border-0 border-b-2 border-gris-claro focus:border-azul outline-none py-2 bg-transparent transition-colors" />
              </Card>
              <Card title="Bajada">
                <textarea value={form.bajada} onChange={e => set('bajada', e.target.value)} rows={2}
                  className="w-full border border-gris-claro rounded px-3 py-2 focus:border-azul outline-none resize-none text-sm transition-colors bg-white" />
              </Card>
              <Card title="Cuerpo *">
                <textarea value={form.cuerpo} onChange={e => set('cuerpo', e.target.value)} rows={12} required
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
                    className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors" />
                </Card>
                <Card title="Fecha">
                  <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)}
                    className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors" />
                </Card>
                <Card title="En portada">
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <div onClick={() => set('destacado', !form.destacado)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${form.destacado ? 'bg-azul' : 'bg-gris-medio'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.destacado ? 'left-7' : 'left-1'}`} />
                    </div>
                    <span className="text-sm">{form.destacado ? 'En portada' : 'Solo sección'}</span>
                  </label>
                </Card>
              </div>
              <Card title="Imagen">
                <ImageUploader value={form.imagen_url} onChange={url => set('imagen_url', url)} />
              </Card>
              <Card title="Video YouTube (opcional)">
                <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors" />
              </Card>
            </>
          )}

          {tab === 'seo' && (
            <>
              <Card title="Slug (URL)">
                <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)}
                  className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm font-mono bg-white transition-colors" />
                <p className="text-xs text-gris-medio mt-1">nandestream.com/nota/{form.slug}</p>
              </Card>
              <Card title="SEO Title">
                <input type="text" value={form.seo_title} onChange={e => set('seo_title', e.target.value)}
                  className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors" />
                <p className="text-xs text-gris-medio mt-1">{form.seo_title.length}/60</p>
              </Card>
              <Card title="Meta description">
                <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} rows={3}
                  className="w-full border border-gris-claro rounded px-3 py-2 focus:border-azul outline-none text-sm resize-none bg-white transition-colors" />
                <p className="text-xs text-gris-medio mt-1">{form.meta_description.length}/155</p>
              </Card>
              <Card title="Tags">
                <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)}
                  className="w-full border border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm bg-white transition-colors" />
              </Card>
            </>
          )}

          <div className="flex gap-3 justify-end pt-2 pb-6">
            <button type="button" onClick={() => router.push('/admin/notas')}
              className="px-5 py-3 border border-gris-claro text-gris-medio rounded hover:border-tinta hover:text-tinta transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={status === 'loading'}
              className="px-8 py-3 bg-azul hover:bg-azul-claro text-white font-bold rounded transition-colors disabled:opacity-50 text-sm">
              {status === 'loading' ? 'Guardando...' : 'Guardar cambios'}
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
