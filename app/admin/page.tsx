import AdminLayout from '@/components/admin/AdminLayout';
import { getTodasLasNotas } from '@/lib/supabase';
import Link from 'next/link';
import { ESTADOS } from '@/lib/types';
import { formatFechaCorta } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminDashboard() {
  const notas = await getTodasLasNotas();

  const publicadas  = notas.filter(n => n.estado === 'publicado').length;
  const borradores  = notas.filter(n => n.estado === 'borrador').length;
  const programadas = notas.filter(n => n.estado === 'programado').length;
  const destacadas  = notas.filter(n => n.destacado && n.estado === 'publicado').length;
  const hoy = new Date().toISOString().split('T')[0];
  const deHoy = notas.filter(n => n.fecha === hoy).length;
  const recientes = notas.slice(0, 8);

  const estadoInfo = (e: string) => ESTADOS.find(s => s.value === e) ?? ESTADOS[0];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="font-display text-xl text-tinta mb-6">Panel de redacción</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <StatCard label="Publicadas" value={publicadas} color="border-green-400" />
          <StatCard label="Borradores" value={borradores} color="border-yellow-400" />
          <StatCard label="Programadas" value={programadas} color="border-blue-400" />
          <StatCard label="En portada" value={destacadas} color="border-acento" />
          <StatCard label="Hoy" value={deHoy} color="border-rojo" />
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          <ActionCard href="/admin/nueva-nota" label="Nueva nota" desc="Escribir o generar con IA" primary />
          <ActionCard href="/admin/notas" label="Notas" desc="Listar y gestionar" />
          <ActionCard href="/admin/deportes-rss" label="RSS Deportes" desc="Importar y generar" />
          <ActionCard href="/admin/configuracion" label="Configuración" desc="Stream, redes, ticker" />
        </div>

        {/* Últimas notas */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gris-claro">
            <h2 className="font-semibold text-sm text-tinta">Últimas notas</h2>
            <Link href="/admin/notas" className="text-xs text-rojo font-semibold hover:opacity-70">Ver todas →</Link>
          </div>
          {recientes.length === 0 ? (
            <div className="px-4 py-10 text-center text-gris-medio text-sm">
              Sin notas.{' '}
              <Link href="/admin/nueva-nota" className="text-rojo font-semibold">Crear la primera →</Link>
            </div>
          ) : recientes.map(nota => (
            <div key={nota.id} className="newsroom-row px-4 py-3 grid gap-3" style={{ gridTemplateColumns: '1fr auto' }}>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${estadoInfo(nota.estado).color}`}>
                    {estadoInfo(nota.estado).label}
                  </span>
                  <span className="text-[0.58rem] text-gris-medio uppercase">{nota.categoria}</span>
                  {nota.destacado && nota.estado === 'publicado' && (
                    <span className="text-[0.58rem] text-acento font-bold">★</span>
                  )}
                </div>
                <p className="text-sm font-medium text-tinta line-clamp-1">{nota.titulo}</p>
                <p className="text-xs text-gris-medio mt-0.5">{nota.autor} · {formatFechaCorta(nota.fecha)}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Link href={`/nota/${nota.slug}`} target="_blank"
                  className="text-xs text-gris-medio hover:text-azul px-2 py-1.5 transition-colors hidden md:block">↗</Link>
                <Link href={`/admin/editar/${nota.id}`}
                  className="text-xs font-semibold text-azul border border-azul/25 hover:bg-azul hover:text-white px-3 py-1.5 rounded transition-colors">
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border-l-2 ${color}`}>
      <p className="text-2xl font-display font-bold text-tinta">{value}</p>
      <p className="text-xs text-gris-medio uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}

function ActionCard({ href, label, desc, primary }: { href: string; label: string; desc: string; primary?: boolean }) {
  return (
    <Link href={href}
      className={`flex flex-col gap-1 p-4 rounded-lg shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${primary ? 'bg-rojo text-white' : 'bg-white'}`}>
      <span className={`font-semibold text-sm ${primary ? 'text-white' : 'text-tinta'}`}>{label}</span>
      <span className={`text-xs ${primary ? 'text-white/70' : 'text-gris-medio'}`}>{desc}</span>
    </Link>
  );
}
