import { getNotas, getNotasDestacadas } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminDashboard() {
  const [todas, destacadas] = await Promise.all([
    getNotas(),
    getNotasDestacadas(),
  ]);

  const hoy = new Date().toISOString().split('T')[0];
  const deHoy = todas.filter(n => n.fecha === hoy).length;

  const porCategoria = todas.reduce((acc, n) => {
    acc[n.categoria] = (acc[n.categoria] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recientes = todas.slice(0, 5);

  return (
    <div className="min-h-screen bg-gris-claro">
      {/* Header */}
      <div className="bg-azul text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rojo rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
          </div>
          <span className="font-display font-bold text-lg">Ñande Stream</span>
          <span className="text-white/40 text-sm">/ Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-white/60 text-sm hover:text-white transition-colors">Ver sitio →</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-display text-2xl text-tinta mb-8">Panel de administración</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total de notas" value={todas.length} color="bg-azul" />
          <StatCard label="Destacadas" value={destacadas.length} color="bg-rojo" />
          <StatCard label="Publicadas hoy" value={deHoy} color="bg-green-600" />
          <StatCard label="Categorías activas" value={Object.keys(porCategoria).length} color="bg-[#6B3F1A]" />
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <ActionCard
            href="/admin/nueva-nota"
            icon="✏️"
            title="Nueva nota"
            desc="Cargar una nota nueva al portal"
            primary
          />
          <ActionCard
            href="/admin/notas"
            icon="📋"
            title="Ver todas las notas"
            desc="Listar, editar y eliminar notas"
          />
          <ActionCard
            href="/en-vivo"
            icon="🔴"
            title="Ver stream en vivo"
            desc="Ir a la página de transmisión"
          />
        </div>

        {/* Notas recientes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gris-claro">
            <h2 className="font-semibold text-tinta">Últimas notas publicadas</h2>
            <Link href="/admin/notas" className="text-xs text-rojo font-semibold hover:opacity-70 transition-opacity">
              Ver todas →
            </Link>
          </div>

          {recientes.length === 0 ? (
            <div className="px-5 py-10 text-center text-gris-medio text-sm">
              No hay notas todavía.{' '}
              <Link href="/admin/nueva-nota" className="text-rojo font-semibold">Crear la primera →</Link>
            </div>
          ) : (
            recientes.map(nota => (
              <div key={nota.id} className="flex items-center justify-between px-5 py-3.5 border-b border-gris-claro last:border-0 hover:bg-gris-claro/40 transition-colors">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-semibold text-tinta truncate">{nota.titulo}</p>
                  <p className="text-xs text-gris-medio mt-0.5">
                    {nota.categoria} · {nota.fecha}
                    {nota.destacado && <span className="ml-2 text-green-600 font-semibold">● Destacada</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/nota/${nota.slug}`}
                    target="_blank"
                    className="text-xs text-gris-medio hover:text-tinta transition-colors px-2 py-1"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/admin/editar/${nota.id}`}
                    className="text-xs font-semibold text-azul border border-azul/30 hover:bg-azul hover:text-white px-3 py-1.5 rounded transition-colors"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Distribución por categoría */}
        {Object.keys(porCategoria).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-5 mt-4">
            <h2 className="font-semibold text-tinta mb-4">Notas por categoría</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(porCategoria)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <span key={cat} className="inline-flex items-center gap-2 bg-gris-claro text-tinta text-sm px-3 py-1.5 rounded">
                    <span className="capitalize font-medium">{cat}</span>
                    <span className="bg-azul text-white text-xs font-bold px-1.5 py-0.5 rounded">{count}</span>
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className={`w-2 h-2 rounded-full ${color} mb-3`} />
      <p className="text-3xl font-display font-bold text-tinta">{value}</p>
      <p className="text-xs text-gris-medio mt-1 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function ActionCard({ href, icon, title, desc, primary }: {
  href: string; icon: string; title: string; desc: string; primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-start gap-4 p-5 rounded-lg shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        primary ? 'bg-rojo text-white' : 'bg-white text-tinta'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className={`font-semibold ${primary ? 'text-white' : 'text-tinta'}`}>{title}</p>
        <p className={`text-sm mt-0.5 ${primary ? 'text-white/70' : 'text-gris-medio'}`}>{desc}</p>
      </div>
    </Link>
  );
}
