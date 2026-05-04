'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';

type Banner = {
  id: string;
  imagen_url: string;
  link_url: string;
  titulo: string;
  activo: boolean;
  posicion: number;
};

const EMPTY = { imagen_url: '', link_url: '', titulo: '', activo: true, posicion: 0 };

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Banner | null>(null);
  const [nuevo, setNuevo] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function cargar() {
    setLoading(true);
    const res = await fetch('/api/admin/banners');
    const data = await res.json();
    setBanners(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { cargar(); }, []);

  function startEdit(b: Banner) {
    setEditando(b);
    setForm({ imagen_url: b.imagen_url, link_url: b.link_url, titulo: b.titulo, activo: b.activo, posicion: b.posicion });
    setNuevo(false);
  }

  function startNuevo() {
    setEditando(null);
    setForm(EMPTY);
    setNuevo(true);
  }

  async function guardar() {
    if (!form.imagen_url) { setMsg('La imagen es obligatoria'); return; }
    setSaving(true);
    const body = editando
      ? { action: 'editar', id: editando.id, ...form }
      : { action: 'crear', ...form };
    const res = await fetch('/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMsg('Guardado'); setEditando(null); setNuevo(false);
      cargar();
    } else setMsg('Error al guardar');
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este banner?')) return;
    await fetch('/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'eliminar', id }),
    });
    cargar();
  }

  async function toggleActivo(b: Banner) {
    await fetch('/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'editar', id: b.id, activo: !b.activo }),
    });
    setBanners(bs => bs.map(x => x.id === b.id ? { ...x, activo: !x.activo } : x));
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-xl text-tinta">Banners</h1>
            <p className="text-sm text-gris-medio mt-0.5">Aparecen entre las noticias destacadas y las recientes en el home.</p>
          </div>
          <button onClick={startNuevo}
            className="bg-azul hover:bg-azul-claro text-white text-sm font-bold px-4 py-2.5 rounded transition-colors">
            + Nuevo banner
          </button>
        </div>

        {msg && (
          <div className={`px-4 py-3 rounded mb-4 text-sm font-medium ${msg === 'Guardado' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {msg}
          </div>
        )}

        {/* Formulario */}
        {(editando || nuevo) && (
          <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border-l-2 border-azul">
            <h2 className="font-semibold text-sm text-tinta mb-4">{nuevo ? 'Nuevo banner' : 'Editar banner'}</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">Imagen *</label>
                <ImageUploader value={form.imagen_url} onChange={url => setForm(f => ({ ...f, imagen_url: url }))} />
              </div>
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">URL destino (al hacer clic)</label>
                <input type="url" value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">Título (referencia interna)</label>
                  <input type="text" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    placeholder="Ej: Banner publicitario mayo"
                    className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">Posición (orden)</label>
                  <input type="number" value={form.posicion} onChange={e => setForm(f => ({ ...f, posicion: Number(e.target.value) }))}
                    min={0}
                    className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setEditando(null); setNuevo(false); }}
                  className="px-5 py-2.5 border border-gris-claro text-gris-medio rounded text-sm hover:border-tinta transition-colors">
                  Cancelar
                </button>
                <button onClick={guardar} disabled={saving}
                  className="flex-1 bg-azul hover:bg-azul-claro text-white font-bold py-2.5 rounded text-sm disabled:opacity-50 transition-colors">
                  {saving ? 'Guardando...' : 'Guardar banner'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de banners */}
        {loading ? (
          <div className="bg-white rounded-lg p-10 text-center text-gris-medio text-sm">Cargando...</div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-lg p-10 text-center text-gris-medio border-2 border-dashed border-gris-claro">
            No hay banners. Creá el primero.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {banners.map(b => (
              <div key={b.id} className="newsroom-row px-4 py-4 grid gap-4 items-center"
                style={{ gridTemplateColumns: '80px 1fr auto' }}>
                {/* Preview imagen */}
                <div className="w-20 h-12 rounded overflow-hidden bg-gris-claro flex-shrink-0">
                  {b.imagen_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.imagen_url} alt={b.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gris-claro" />
                  )}
                </div>
                {/* Info */}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-tinta">{b.titulo || 'Sin título'}</p>
                  {b.link_url && <p className="text-xs text-gris-medio truncate mt-0.5">{b.link_url}</p>}
                  <p className="text-xs text-gris-medio mt-0.5">Posición {b.posicion}</p>
                </div>
                {/* Acciones */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleActivo(b)}
                    className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${b.activo ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600' : 'bg-gris-claro text-gris-medio hover:bg-green-100 hover:text-green-700'}`}>
                    {b.activo ? 'Activo' : 'Inactivo'}
                  </button>
                  <button onClick={() => startEdit(b)}
                    className="text-xs font-semibold text-azul border border-azul/25 hover:bg-azul hover:text-white px-3 py-1.5 rounded transition-colors">
                    Editar
                  </button>
                  <button onClick={() => eliminar(b.id)}
                    className="w-8 h-8 flex items-center justify-center text-gris-medio hover:text-red-500 transition-colors rounded hover:bg-red-50">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gris-medio mt-4">
          Los banners activos aparecen en el home entre las destacadas y las noticias recientes. Podés subir la imagen desde el celu o pegar una URL.
        </p>
      </div>
    </AdminLayout>
  );
}
