'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { Nota, CATEGORIAS, ESTADOS } from '@/lib/types';
import { formatFechaCorta } from '@/lib/utils';

export default function AdminNotasPage() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [filtro, setFiltro] = useState('');
  const [catFiltro, setCatFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/listar-notas');
    const data = await res.json();
    setNotas(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  async function toggleDestacado(id: string, actual: boolean) {
    await fetch('/api/admin/toggle-destacado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, destacado: !actual }),
    });
    setNotas(ns => ns.map(n => n.id === id ? { ...n, destacado: !actual } : n));
  }

  async function cambiarEstado(id: string, estado: string) {
    await fetch('/api/admin/editar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado }),
    });
    setNotas(ns => ns.map(n => n.id === id ? { ...n, estado: estado as Nota['estado'] } : n));
  }

  async function eliminar(id: string, titulo: string) {
    if (!confirm(`¿Eliminar "${titulo}"?`)) return;
    await fetch('/api/admin/eliminar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotas(ns => ns.filter(n => n.id !== id));
  }

  const filtradas = notas.filter(n => {
    const txt = n.titulo.toLowerCase().includes(filtro.toLowerCase());
    const cat = catFiltro ? n.categoria === catFiltro : true;
    const est = estadoFiltro ? n.estado === estadoFiltro : true;
    return txt && cat && est;
  });

  const estadoInfo = (e: string) => ESTADOS.find(s => s.value === e) ?? ESTADOS[0];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-display text-xl text-tinta">
            Notas
            <span className="ml-2 text-sm font-sans font-normal text-gris-medio">({filtradas.length})</span>
          </h1>
          <Link href="/admin/nueva-nota"
            className="bg-rojo hover:bg-rojo-oscuro text-white text-sm font-bold px-4 py-2.5 rounded transition-colors">
            + Nueva
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-5 flex-wrap">
          <input type="text" placeholder="Buscar..." value={filtro} onChange={e => setFiltro(e.target.value)}
            className="flex-1 min-w-[180px] border border-gris-claro rounded px-3 py-2 text-sm focus:border-azul outline-none bg-white" />
          <select value={catFiltro} onChange={e => setCatFiltro(e.target.value)}
            className="border border-gris-claro rounded px-3 py-2 text-sm focus:border-azul outline-none bg-white">
            <option value="">Todas</option>
            {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}
            className="border border-gris-claro rounded px-3 py-2 text-sm focus:border-azul outline-none bg-white">
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg p-16 text-center text-gris-medio text-sm">Cargando...</div>
        ) : filtradas.length === 0 ? (
          <div className="bg-white rounded-lg p-16 text-center text-gris-medio border-2 border-dashed border-gris-claro">
            <p className="mb-2">{notas.length === 0 ? 'No hay notas.' : 'Sin resultados.'}</p>
            {notas.length === 0 && (
              <Link href="/admin/nueva-nota" className="text-rojo font-semibold">Crear la primera →</Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filtradas.map(nota => (
              <div key={nota.id} className="newsroom-row px-4 py-3.5"
                style={{ gridTemplateColumns: '1fr auto' }}>
                <div className="grid" style={{ gridTemplateColumns: '1fr auto' }}>
                  {/* Info */}
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${estadoInfo(nota.estado).color}`}>
                        {estadoInfo(nota.estado).label}
                      </span>
                      <span className="text-[0.6rem] font-bold uppercase tracking-wider text-azul/70 bg-azul/8 px-2 py-0.5 rounded">
                        {nota.categoria}
                      </span>
                      {nota.destacado && (
                        <span className="text-[0.6rem] font-bold text-acento">★ Portada</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-tinta line-clamp-1 mb-0.5">{nota.titulo}</p>
                    <p className="text-xs text-gris-medio">{nota.autor} · {formatFechaCorta(nota.fecha)}</p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Toggle portada */}
                    <button onClick={() => toggleDestacado(nota.id, nota.destacado)}
                      title={nota.destacado ? 'Quitar de portada' : 'Poner en portada'}
                      className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-colors ${nota.destacado ? 'bg-acento/15 text-acento' : 'bg-gris-claro text-gris-medio hover:bg-acento/15 hover:text-acento'}`}>
                      ★
                    </button>

                    {/* Cambiar estado rápido */}
                    <select value={nota.estado}
                      onChange={e => cambiarEstado(nota.id, e.target.value)}
                      className="text-xs border border-gris-claro rounded px-2 py-1.5 bg-white focus:border-azul outline-none hidden md:block">
                      {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>

                    {/* Ver */}
                    <Link href={`/nota/${nota.slug}`} target="_blank"
                      className="hidden md:flex w-8 h-8 items-center justify-center text-gris-medio hover:text-azul transition-colors text-xs rounded">
                      ↗
                    </Link>

                    {/* Editar */}
                    <Link href={`/admin/editar/${nota.id}`}
                      className="text-xs font-semibold text-azul border border-azul/25 hover:bg-azul hover:text-white px-3 py-1.5 rounded transition-colors">
                      Editar
                    </Link>

                    {/* Eliminar */}
                    <button onClick={() => eliminar(nota.id, nota.titulo)}
                      className="w-8 h-8 flex items-center justify-center text-gris-medio hover:text-red-500 transition-colors rounded hover:bg-red-50">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
