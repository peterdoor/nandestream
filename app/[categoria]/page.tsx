import { getNotasByCategoria } from '@/lib/supabase';
import { CATEGORIAS, Categoria } from '@/lib/types';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import NewsCard from '@/components/news/NewsCard';

export const revalidate = 60;

type Props = { params: { categoria: string } };

export async function generateStaticParams() {
  return CATEGORIAS.map(c => ({ categoria: c.value }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = CATEGORIAS.find(c => c.value === params.categoria);
  if (!cat) return {};
  return {
    title: `${cat.label} – Ñande Stream`,
    description: `Cobertura de ${cat.label} en Ñande Stream.`,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const cat = CATEGORIAS.find(c => c.value === params.categoria);
  if (!cat) notFound();

  const notas = await getNotasByCategoria(params.categoria as Categoria);

  return (
    <div className="bg-crema min-h-screen">
      <div className="bg-azul py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-white/40 text-[0.62rem] uppercase tracking-widest mb-1">Sección</p>
          <h1 className="font-display text-3xl text-white">{cat.label}</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {notas.length === 0 ? (
          <div className="text-center py-20 text-gris-medio">
            <p className="text-lg">No hay notas en esta sección todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notas.map(n => <NewsCard key={n.id} nota={n} />)}
          </div>
        )}
      </div>
    </div>
  );
}
