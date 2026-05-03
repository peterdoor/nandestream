'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { Nota, CATEGORIAS } from '@/lib/types';
import { formatFecha } from '@/lib/utils';

export default function AdminNotasPage() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [filtro, setFiltro] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/listar-notas');
    const data = await res.json();
    setNotas(data);
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

  async function eliminar(id: string, titulo: string) {
    if (!confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return;
    await fetch('/api/admin/eliminar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotas(ns => ns.filter(n => n.id !== id));
  }

  const filtradas = notas.filter(n => {
    const matchTexto = n.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
                       n.autor.toLowerCase().includes(filtro.toLowerCase());
    const matchCat = categoria ? n.categoria === categoria : true;
    return matchTexto && matchCat;
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-tinta">
            Notas publicadas
            <span className="ml-3 text-sm font-sans font-normal text-gris-medio">({filtradas.length} de {notas.length})</span>
          </h1>
          <Link href="/admin/nueva-nota" className="bg-rojo hover:bg-rojo-oscuro text-white text-sm font-bold px-4 py-2 rounded transition-colors">
            + Nueva nota
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por título o autor..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="flex-1 border-2 border-gris-claro rounded px-4 py-2 text-sm focus:border-azul outline-none transition-colors bg-white"
          />
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="border-2 border-gris-claro rounded px-3 py-2 text-sm focus:border-azul outline-none bg-white transition-colors"
          >
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg p-16 text-center text-gris-medio text-sm">Cargando...</div>
        ) : filtradas.length === 0 ? (
          <div className="bg-white rounded-lg p-16 text-center text-gris-medio border-2 border-dashed border-gris-claro">
            <p className="text-lg mb-2">{notas.length === 0 ? 'No hay notas publicadas.' : 'No hay resultados para tu búsqueda.'}</p>
            {notas.length === 0 && (
              <Link href="/admin/nueva-nota" className="text-rojo font-semibold hover:opacity-70">Crear la primera →</Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gris-claro text-[0.68rem] font-bold uppercase tracking-wider text-gris-medio border-b border-gris-claro">
              <div className="col-span-4">Título</div>
              <div className="col-span-2">Categoría</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-1 text-center">Portada</div>
              <div className="col-span-3 text-center">Acciones</div>
            </div>

            {filtradas.map(nota => (
              <div key={nota.id} className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center border-b border-gris-claro last:border-0 hover:bg-gris-claro/30 transition-colors">
                <div className="col-span-4">
                  <p className="text-sm font-semibold text-tinta line-clamp-1">{nota.titulo}</p>
                  <p className="text-xs text-gris-medio mt-0.5 truncate">{nota.autor}</p>
                </div>
                <div className="col-span-2">
                  <span className="inline-block bg-azul/10 text-azul text-[0.62rem] font-bold uppercase tracking-wide px-2 py-1 rounded">
                    {nota.categoria}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-gris-medio">{formatFecha(nota.fecha)}</div>
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => toggleDestacado(nota.id, nota.destacado)}
                    title={nota.destacado ? 'Quitar de portada' : 'Destacar en portada'}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors text-sm ${
                      nota.destacado
                        ? 'bg-green-100 text-green-600 hover:bg-red-100 hover:text-red-500'
                        : 'bg-gris-claro text-gris-medio hover:bg-green-100 hover:text-green-600'
                    }`}
                  >
                    {nota.destacado ? '★' : '☆'}
                  </button>
                </div>
                <div className="col-span-3 flex items-center justify-center gap-1.5">
                  <Link
                    href={`/nota/${nota.slug}`}
                    target="_blank"
                    className="text-xs text-gris-medio hover:text-tinta px-2 py-1 transition-colors"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/admin/editar/${nota.id}`}
                    className="text-xs font-semibold text-azul border border-azul/30 hover:bg-azul hover:text-white px-3 py-1.5 rounded transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => eliminar(nota.id, nota.titulo)}
                    className="text-xs font-semibold text-red-400 border border-red-200 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded transition-colors"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
