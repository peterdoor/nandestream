import { getNotaBySlug, getNotasRecientes, getBanners } from '@/lib/supabase';
import { formatFecha } from '@/lib/utils';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import NewsCard from '@/components/news/NewsCard';
import VideoEmbed from '@/components/news/VideoEmbed';
import BannerSlot from '@/components/ui/BannerSlot';

export const revalidate = 60;
type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const nota = await getNotaBySlug(params.slug);
  if (!nota) return { title: 'Nota no encontrada' };
  return {
    title: nota.seo_title || nota.titulo,
    description: nota.meta_description || nota.bajada,
    openGraph: {
      title: nota.seo_title || nota.titulo,
      description: nota.meta_description || nota.bajada,
      images: nota.imagen_url ? [{ url: nota.imagen_url }] : [],
      type: 'article',
    },
  };
}

export default async function NotaPage({ params }: Props) {
  const [nota, recientes, bannersSidebar] = await Promise.all([
    getNotaBySlug(params.slug),
    getNotasRecientes(6),
    getBanners('sidebar'),
  ]);

  if (!nota) notFound();

  const relacionadas = recientes.filter(n => n.slug !== nota.slug).slice(0, 3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nandestream.com';
  const notaUrl = `${siteUrl}/nota/${nota.slug}`;

  const shareLinks = [
    { label: 'WhatsApp', color: 'bg-[#25D366]', href: `https://wa.me/?text=${encodeURIComponent(nota.titulo + ' ' + notaUrl)}` },
    { label: 'Facebook', color: 'bg-[#1877F2]', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(notaUrl)}` },
    { label: 'X', color: 'bg-black', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(nota.titulo)}&url=${encodeURIComponent(notaUrl)}` },
  ];

  return (
    <div className="bg-crema min-h-screen">
      <div className="bg-gris-claro border-b border-gris-medio/20 py-2.5">
        <div className="max-w-7xl mx-auto px-4 text-[0.7rem] text-gris-medio flex gap-2">
          <Link href="/" className="hover:text-tinta transition-colors">Inicio</Link>
          <span>›</span>
          <Link href={`/${nota.categoria}`} className="capitalize hover:text-tinta transition-colors">{nota.categoria}</Link>
          <span>›</span>
          <span className="text-tinta line-clamp-1 hidden md:block">{nota.titulo}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <article className="lg:col-span-2">
            <span className="inline-block bg-rojo text-white text-[0.58rem] uppercase tracking-widest font-bold px-3 py-1.5 rounded-sm mb-4">
              {nota.categoria}
            </span>

            <h1 className="font-display text-2xl md:text-3xl leading-tight mb-4 text-tinta">{nota.titulo}</h1>

            {nota.bajada && (
              <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-rojo pl-4 mb-4">{nota.bajada}</p>
            )}

            {/* COMPARTIR — arriba, después de la bajada */}
            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gris-claro">
              <span className="text-xs font-semibold text-gris-medio mr-1">Compartir:</span>
              {shareLinks.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className={`${s.color} text-white text-xs font-medium px-3 py-1.5 rounded hover:opacity-90 transition-opacity`}>
                  {s.label}
                </a>
              ))}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-gris-medio mb-6">
              <span className="font-medium text-tinta">{nota.autor}</span>
              <span>·</span>
              <span>{formatFecha(nota.fecha)}</span>
            </div>

            {nota.imagen_url && (
              <div className="relative w-full mb-6 rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <Image src={nota.imagen_url} alt={nota.titulo} fill className="object-cover" />
              </div>
            )}

            {nota.video_url && (
              <div className="mb-6"><VideoEmbed url={nota.video_url} titulo={nota.titulo} /></div>
            )}

            <div className="prose-nota"
              dangerouslySetInnerHTML={{ __html: nota.cuerpo.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>') }} />

            {/* Bloque stream */}
            <div className="mt-10 bg-azul rounded-lg p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-rojo rounded flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Segui el debate en Nande Stream</p>
                <p className="text-white/55 text-xs mt-0.5">Analisis y conversacion en vivo sobre la actualidad paraguaya</p>
              </div>
              <Link href="/en-vivo"
                className="flex-shrink-0 bg-rojo hover:bg-rojo-oscuro text-white text-xs font-bold px-4 py-2 rounded transition-colors">
                Ver en vivo →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-5">
            {bannersSidebar.map(b => (
              <BannerSlot key={b.id} {...b} className="rounded w-full" />
            ))}
            <div>
              <h3 className="font-display text-lg mb-4 border-b-2 border-rojo pb-2 text-tinta">Mas noticias</h3>
              <div className="flex flex-col gap-5">
                {relacionadas.map(n => (
                  <NewsCard key={n.id} nota={n} variant="small" />
                ))}
              </div>
            </div>
            <div className="bg-azul rounded-lg p-4 text-center">
              <div className="w-8 h-8 bg-rojo rounded flex items-center justify-center mx-auto mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
              </div>
              <p className="text-white font-semibold text-sm mb-1">Nande Stream</p>
              <p className="text-white/50 text-xs mb-3">Informacion en vivo</p>
              <Link href="/en-vivo"
                className="block bg-rojo hover:bg-rojo-oscuro text-white text-xs font-bold py-2 rounded transition-colors">
                Ver transmision →
              </Link>
            </div>
          </aside>
        </div>

        {relacionadas.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-2xl mb-6 border-b border-gris-claro pb-3 text-tinta relative">
              Tambien te puede interesar
              <span className="absolute left-0 -bottom-0.5 w-24 h-0.5 bg-rojo" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relacionadas.map(n => <NewsCard key={n.id} nota={n} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
