import { getNotas } from '@/lib/supabase';
import { formatFecha } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminNotasPage() {
  const notas = await getNotas();

  return (
    <div className="min-h-screen bg-gris-claro">
      <div className="bg-azul text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rojo rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
          </div>
          <span className="font-display font-bold">Ñande Stream</span>
          <span className="text-white/40 text-sm">/ Notas publicadas</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-white/60 text-sm hover:text-white transition-colors">← Ver sitio</a>
          <Link href="/admin/nueva-nota" className="bg-rojo hover:bg-rojo-oscuro text-white text-sm font-bold px-4 py-2 rounded transition-colors">
            + Nueva nota
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-tinta">
            Notas publicadas
            <span className="ml-3 text-sm font-sans font-normal text-gris-medio">({notas.length} total)</span>
          </h1>
        </div>

        {notas.length === 0 ? (
          <div className="bg-white rounded-lg p-16 text-center text-gris-medio border-2 border-dashed border-gris-claro">
            <p className="text-lg mb-2">No hay notas publicadas todavía.</p>
            <Link href="/admin/nueva-nota" className="text-rojo font-semibold hover:opacity-70 transition-opacity">
              Cargar la primera nota →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gris-claro text-[0.68rem] font-bold uppercase tracking-wider text-gris-medio border-b border-gris-claro">
              <div className="col-span-5">Título</div>
              <div className="col-span-2">Categoría</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-1 text-center">Dest.</div>
              <div className="col-span-2 text-center">Acciones</div>
            </div>

            {notas.map((nota) => (
              <div
                key={nota.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-gris-claro last:border-0 hover:bg-gris-claro/40 transition-colors"
              >
                <div className="col-span-5">
                  <Link
                    href={`/nota/${nota.slug}`}
                    target="_blank"
                    className="font-semibold text-sm text-tinta hover:text-azul transition-colors line-clamp-2 leading-snug"
                  >
                    {nota.titulo}
                  </Link>
                  {nota.bajada && (
                    <p className="text-xs text-gris-medio mt-0.5 line-clamp-1">{nota.bajada}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <span className="inline-block bg-azul/10 text-azul text-[0.65rem] font-bold uppercase tracking-wide px-2 py-1 rounded">
                    {nota.categoria}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-gris-medio">
                  {formatFecha(nota.fecha)}
                </div>
                <div className="col-span-1 text-center">
                  {nota.destacado
                    ? <span className="text-green-600 font-bold">✓</span>
                    : <span className="text-gris-medio">—</span>
                  }
                </div>
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/editar/${nota.id}`}
                    className="text-xs font-semibold text-azul border border-azul/30 hover:bg-azul hover:text-white px-3 py-1.5 rounded transition-colors"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
