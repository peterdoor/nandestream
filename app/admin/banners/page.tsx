'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';

type Banner = {
  id: string; imagen_url: string; link_url: string;
  titulo: string; activo: boolean; posicion: number; tipo: string;
};

const TIPOS = [
  { value: 'destacadas', label: 'Banner Destacadas', desc: 'Cuadrado/vertical a los costados de la nota del medio. Máximo 2. Ordenados por posición.' },
  { value: 'home1',      label: 'Home 1 — horizontal', desc: 'Franja ancha entre destacadas y más recientes. Múltiples, ordenados por posición.' },
  { value: 'home2',      label: 'Home 2 — horizontal', desc: 'Franja ancha entre más recientes y Kachiai. Múltiples, ordenados por posición.' },
  { value: 'sidebar',    label: 'Sidebar — notas', desc: 'Columna derecha en páginas de notas. Múltiples, ordenados por posición.' },
];

const EMPTY = { imagen_url: '', link_url: '', titulo: '', activo: true, posicion: 0, tipo: 'destacadas' };

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
    setForm({ imagen_url: b.imagen_url, link_url: b.link_url, titulo: b.titulo, activo: b.activo, posicion: b.posicion, tipo: b.tipo || 'destacadas' });
    setNuevo(false);
  }

  function startNuevo() { setEditando(null); setForm(EMPTY); setNuevo(true); }

  async function guardar() {
    if (!form.imagen_url) { setMsg('La imagen es obligatoria'); setTimeout(() => setMsg(''), 3000); return; }
    // Validar máximo 2 en tipo "destacadas"
    if (form.tipo === 'destacadas' && !editando) {
      const destActivos = banners.filter(b => b.tipo === 'destacadas' && b.activo);
      if (destActivos.length >= 2) {
        setMsg('Solo se permiten 2 banners de tipo Destacadas. Desactivá uno primero.');
        setTimeout(() => setMsg(''), 4000);
        return;
      }
    }
    setSaving(true);
    const body = editando
      ? { action: 'editar', id: editando.id, ...form }
      : { action: 'crear', ...form };
    const res = await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) { setMsg('Guardado'); setEditando(null); setNuevo(false); cargar(); }
    else setMsg('Error al guardar');
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este banner?')) return;
    await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'eliminar', id }),
    });
    cargar();
  }

  async function toggleActivo(b: Banner) {
    // Verificar límite de 2 para destacadas
    if (!b.activo && b.tipo === 'destacadas') {
      const destActivos = banners.filter(x => x.tipo === 'destacadas' && x.activo);
      if (destActivos.length >= 2) {
        setMsg('Solo se permiten 2 banners Destacadas activos.');
        setTimeout(() => setMsg(''), 3000);
        return;
      }
    }
    await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'editar', id: b.id, activo: !b.activo }),
    });
    setBanners(bs => bs.map(x => x.id === b.id ? { ...x, activo: !x.activo } : x));
  }

  const tipoInfo = (t: string) => TIPOS.find(x => x.value === t) ?? TIPOS[0];

  // Agrupar por tipo para mostrar
  const porTipo = TIPOS.map(t => ({
    ...t,
    items: banners.filter(b => b.tipo === t.value),
  }));

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-xl text-tinta">Banners</h1>
            <p className="text-xs text-gris-medio mt-0.5">Gestioná los espacios publicitarios del sitio.</p>
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
              {/* Tipo */}
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">Tipo *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {TIPOS.map(t => (
                    <label key={t.value} className={`flex items-start gap-2.5 p-3 rounded border cursor-pointer transition-colors ${form.tipo === t.value ? 'border-azul bg-azul/5' : 'border-gris-claro hover:border-azul/40'}`}>
                      <input type="radio" name="tipo" value={t.value} checked={form.tipo === t.value}
                        onChange={() => setForm(f => ({ ...f, tipo: t.value }))} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-tinta">{t.label}</p>
                        <p className="text-[0.62rem] text-gris-medio mt-0.5 leading-relaxed">{t.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {/* Imagen */}
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">Imagen *</label>
                <ImageUploader value={form.imagen_url} onChange={url => setForm(f => ({ ...f, imagen_url: url }))} />
              </div>
              {/* URL y datos */}
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">URL destino (clic)</label>
                <input type="url" value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))}
                  placeholder="https://..." className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">Nombre interno</label>
                  <input type="text" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    placeholder="Ej: Promo mayo" className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2">Posición (orden)</label>
                  <input type="number" value={form.posicion} min={0}
                    onChange={e => setForm(f => ({ ...f, posicion: Number(e.target.value) }))}
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

        {/* Lista agrupada por tipo */}
        {loading ? (
          <div className="bg-white rounded-lg p-10 text-center text-gris-medio text-sm">Cargando...</div>
        ) : (
          <div className="flex flex-col gap-6">
            {porTipo.map(grupo => (
              <div key={grupo.value}>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-sm font-bold text-tinta">{grupo.label}</h2>
                  <span className="text-xs text-gris-medio">{grupo.items.length} banner{grupo.items.length !== 1 ? 's' : ''}</span>
                  {grupo.value === 'destacadas' && (
                    <span className="text-[0.6rem] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">Máx. 2</span>
                  )}
                </div>
                {grupo.items.length === 0 ? (
                  <div className="bg-white rounded-lg p-5 text-center text-gris-medio text-xs border border-dashed border-gris-claro">
                    Sin banners — apretá "+ Nuevo banner" y elegí este tipo
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {grupo.items.map(b => (
                      <div key={b.id} className="newsroom-row px-4 py-3.5 grid gap-4 items-center border-b border-gris-claro last:border-0"
                        style={{ gridTemplateColumns: '56px 1fr auto' }}>
                        <div className="w-14 h-10 rounded overflow-hidden bg-gris-claro flex-shrink-0">
                          {b.imagen_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={b.imagen_url} alt={b.titulo} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-tinta">{b.titulo || 'Sin nombre'}</p>
                          <p className="text-xs text-gris-medio">Posición {b.posicion}{b.link_url ? ` · ${b.link_url.slice(0, 40)}...` : ''}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button onClick={() => toggleActivo(b)}
                            className={`text-xs font-bold px-2.5 py-1.5 rounded transition-colors ${b.activo ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600' : 'bg-gris-claro text-gris-medio hover:bg-green-100 hover:text-green-700'}`}>
                            {b.activo ? 'Activo' : 'Inactivo'}
                          </button>
                          <button onClick={() => startEdit(b)}
                            className="text-xs font-semibold text-azul border border-azul/25 hover:bg-azul hover:text-white px-2.5 py-1.5 rounded transition-colors">
                            Editar
                          </button>
                          <button onClick={() => eliminar(b.id)}
                            className="w-7 h-7 flex items-center justify-center text-gris-medio hover:text-red-500 transition-colors rounded hover:bg-red-50 text-xs">
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
