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
    description: `Toda la cobertura de ${cat.label} en Ñande Stream, el medio digital paraguayo.`,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const cat = CATEGORIAS.find(c => c.value === params.categoria);
  if (!cat) notFound();

  const notas = await getNotasByCategoria(params.categoria as Categoria);

  return (
    <div className="bg-crema min-h-screen">
      {/* Header de sección */}
      <div className="bg-azul text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Sección</p>
          <h1 className="font-display text-4xl">{cat.label}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {notas.length === 0 ? (
          <div className="text-center py-20 text-gris-medio">
            <p className="text-lg">No hay notas publicadas en esta sección todavía.</p>
            <p className="text-sm mt-2">Volvé pronto o explorá otras secciones.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notas.map(n => (
              <NewsCard key={n.id} nota={n} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
