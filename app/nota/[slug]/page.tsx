import { getNotaBySlug, getNotasRecientes } from '@/lib/supabase';
import { formatFecha } from '@/lib/utils';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import NewsCard from '@/components/news/NewsCard';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const nota = await getNotaBySlug(params.slug);
  if (!nota) return { title: 'Nota no encontrada' };
  return {
    title: nota.titulo,
    description: nota.bajada,
    openGraph: {
      title: nota.titulo,
      description: nota.bajada,
      images: nota.imagen_url ? [{ url: nota.imagen_url }] : [],
      type: 'article',
    },
  };
}

export default async function NotaPage({ params }: Props) {
  const [nota, recientes] = await Promise.all([
    getNotaBySlug(params.slug),
    getNotasRecientes(4),
  ]);

  if (!nota) notFound();

  const relacionadas = recientes.filter(n => n.slug !== nota.slug).slice(0, 3);

  return (
    <div className="bg-crema">
      {/* Breadcrumb */}
      <div className="bg-gris-claro border-b border-gris-medio/20 py-3">
        <div className="max-w-7xl mx-auto px-4 text-[0.72rem] text-gris-medio flex gap-2">
          <Link href="/" className="hover:text-tinta transition-colors">Inicio</Link>
          <span>›</span>
          <Link href={`/${nota.categoria}`} className="capitalize hover:text-tinta transition-colors">{nota.categoria}</Link>
          <span>›</span>
          <span className="text-tinta line-clamp-1">{nota.titulo}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Artículo */}
          <article className="lg:col-span-2">
            <span className="inline-block bg-rojo text-white text-[0.62rem] uppercase tracking-widest font-bold px-3 py-1.5 rounded-sm mb-4">
              {nota.categoria}
            </span>

            <h1 className="font-display text-3xl md:text-4xl leading-tight mb-4">{nota.titulo}</h1>

            {nota.bajada && (
              <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-rojo pl-4 mb-6">
                {nota.bajada}
              </p>
            )}

            <div className="flex items-center gap-3 text-sm text-gris-medio mb-8 pb-6 border-b border-gris-claro">
              <span className="font-medium text-tinta">{nota.autor}</span>
              <span>·</span>
              <span>{formatFecha(nota.fecha)}</span>
            </div>

            {nota.imagen_url && (
              <div className="relative w-full mb-8 rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <Image src={nota.imagen_url} alt={nota.titulo} fill className="object-cover" />
              </div>
            )}

            {/* Video opcional */}
            {nota.video_url && (
              <div className="mb-8 rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <iframe
                  className="w-full h-full"
                  src={nota.video_url.replace('watch?v=', 'embed/')}
                  allowFullScreen
                />
              </div>
            )}

            {/* Cuerpo */}
            <div
              className="prose-nota text-[1.02rem]"
              dangerouslySetInnerHTML={{ __html: nota.cuerpo.replace(/\n/g, '<br/>') }}
            />

            {/* Compartir */}
            <div className="mt-10 pt-6 border-t border-gris-claro">
              <p className="text-sm font-semibold mb-3">Compartir esta nota:</p>
              <div className="flex gap-2 flex-wrap">
                <ShareBtn
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/nota/${nota.slug}`)}`}
                  label="Facebook"
                  color="bg-[#1877F2]"
                />
                <ShareBtn
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(nota.titulo)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/nota/${nota.slug}`)}`}
                  label="X / Twitter"
                  color="bg-black"
                />
                <ShareBtn
                  href={`https://wa.me/?text=${encodeURIComponent(`${nota.titulo} ${process.env.NEXT_PUBLIC_SITE_URL}/nota/${nota.slug}`)}`}
                  label="WhatsApp"
                  color="bg-[#25D366]"
                />
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside>
            <h3 className="font-display text-xl mb-4 border-b-2 border-rojo pb-2">Más noticias</h3>
            <div className="flex flex-col gap-5">
              {relacionadas.map(n => (
                <NewsCard key={n.id} nota={n} variant="small" />
              ))}
            </div>
          </aside>
        </div>

        {/* Relacionadas */}
        {relacionadas.length > 0 && (
          <div className="mt-16">
            <h3 className="font-display text-2xl mb-6 border-b-2 border-gris-claro pb-3 relative">
              También te puede interesar
              <span className="absolute left-0 -bottom-0.5 w-32 h-0.5 bg-rojo" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relacionadas.map(n => (
                <NewsCard key={n.id} nota={n} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShareBtn({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${color} text-white text-sm font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity`}
    >
      {label}
    </a>
  );
}
