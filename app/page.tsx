import { getNotasDestacadas, getNotasRecientes, getNotasByCategoria, getConfig, getBanners } from '@/lib/supabase';
import { CATEGORIAS } from '@/lib/types';
import Link from 'next/link';
import StreamBlock from '@/components/home/StreamBlock';
import NewsCard from '@/components/news/NewsCard';
import BannerSlot from '@/components/ui/BannerSlot';

export const revalidate = 60;

export default async function HomePage() {
  const [config, destacadas, recientes, kachiai,
    bannersDestacadas, bannersHome1, bannersHome2] = await Promise.all([
    getConfig(),
    getNotasDestacadas(4),
    getNotasRecientes(12),
    getNotasByCategoria('kachiai'),
    getBanners('destacadas'),
    getBanners('home1'),
    getBanners('home2'),
  ]);

  const destacadasIds = new Set(destacadas.map(n => n.id));
  const masRecientes = recientes.filter(n => !destacadasIds.has(n.id));

  // Banners destacadas: máximo 2
  const bannerDestIzq = bannersDestacadas[0] ?? null;
  const bannerDestDer = bannersDestacadas[1] ?? null;
  // Nota del medio en fila banner·nota·banner
  const notaMedio = masRecientes[0] ?? null;
  const restRecientes = masRecientes.slice(notaMedio ? 1 : 0, 7);

  return (
    <>
      {/* STREAM */}
      <StreamBlock config={config} />

      {/* DESTACADAS — 4 en grilla 2x2 */}
      {destacadas.length > 0 && (
        <section className="py-10 bg-crema">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Destacadas" href="/actualidad" />
            <div className={`grid gap-px bg-gris-claro border border-gris-claro ${
              destacadas.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'
            }`}>
              {destacadas.map(n => (
                <div key={n.id} className="bg-crema">
                  <NewsCard nota={n} variant="normal" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FILA BANNER·NOTA·BANNER (tipo: destacadas, máx 2) */}
      {(bannerDestIzq || bannerDestDer || notaMedio) && (
        <div className="bg-gris-claro py-5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              {/* Banner izquierdo */}
              {bannerDestIzq
                ? <BannerSlot {...bannerDestIzq} className="rounded w-full h-full object-cover" style={{ minHeight: '200px' }} />
                : <div className="hidden md:block" />
              }
              {/* Nota del medio */}
              {notaMedio && (
                <div className="bg-crema rounded overflow-hidden">
                  <NewsCard nota={notaMedio} variant="normal" />
                </div>
              )}
              {/* Banner derecho */}
              {bannerDestDer
                ? <BannerSlot {...bannerDestDer} className="rounded w-full h-full object-cover" style={{ minHeight: '200px' }} />
                : <div className="hidden md:block" />
              }
            </div>
          </div>
        </div>
      )}

      {/* BANNERS HOME 1 — horizontales, múltiples, ordenados */}
      {bannersHome1.length > 0 && (
        <div className="bg-crema py-3">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-3">
            {bannersHome1.map(b => (
              <BannerSlot key={b.id} {...b} className="rounded w-full" style={{ maxHeight: '120px', objectFit: 'cover' }} />
            ))}
          </div>
        </div>
      )}

      {/* SECCIONES NAV */}
      <div className="bg-azul py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto">
          {CATEGORIAS.map(c => (
            <Link key={c.value} href={`/${c.value}`}
              className="flex-shrink-0 text-[0.72rem] font-bold uppercase tracking-wider text-white/60 hover:text-white border border-white/15 hover:border-white/40 px-4 py-2 rounded transition-all whitespace-nowrap">
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* MÁS RECIENTES — primera tanda */}
      {restRecientes.length > 0 && (
        <section className="py-10 bg-crema">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Más recientes" href="/actualidad" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restRecientes.slice(0, 3).map(n => (
                <NewsCard key={n.id} nota={n} variant="normal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BANNERS HOME 2 — horizontales, múltiples, entre recientes y kachiai */}
      {bannersHome2.length > 0 && (
        <div className="bg-gris-claro py-3">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-3">
            {bannersHome2.map(b => (
              <BannerSlot key={b.id} {...b} className="rounded w-full" style={{ maxHeight: '120px', objectFit: 'cover' }} />
            ))}
          </div>
        </div>
      )}

      {/* KACHIAI */}
      {kachiai.length > 0 && (
        <section className="py-10 bg-gris-claro">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Kachiai" href="/kachiai" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kachiai.slice(0, 3).map(n => (
                <NewsCard key={n.id} nota={n} variant="normal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MÁS RECIENTES — segunda tanda */}
      {restRecientes.length > 3 && (
        <section className="py-10 bg-crema">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restRecientes.slice(3, 6).map(n => (
                <NewsCard key={n.id} nota={n} variant="normal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* QUIÉNES SOMOS */}
      <div className="bg-tinta py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl text-white mb-4">
              Un canal para el <span className="text-acento">Paraguay</span> de hoy
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Ñande Stream es un espacio de información, análisis y conversación pública sobre la actualidad nacional, la gestión institucional y el desarrollo del Paraguay.
            </p>
            <Link href="/quienes-somos"
              className="inline-flex items-center gap-2 bg-rojo hover:bg-rojo-oscuro text-white font-semibold px-6 py-3 rounded transition-colors text-sm">
              Conocer más →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { t: 'Democracia', d: 'Defensa del sistema democrático paraguayo.' },
              { t: 'Comunidad', d: 'Una voz para todos los paraguayos.' },
              { t: 'Identidad', d: 'Cultura guaraní y tradición nacional.' },
              { t: 'Desarrollo', d: 'Crecimiento sostenible para el país.' },
            ].map(v => (
              <div key={v.t} className="bg-white/5 border-l-2 border-rojo p-4">
                <strong className="text-white text-sm block mb-1">{v.t}</strong>
                <p className="text-white/50 text-xs leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-6 border-b border-gris-claro pb-3">
      <h2 className="font-display text-2xl text-tinta relative">
        {title}
        <span className="absolute left-0 -bottom-[13px] h-0.5 w-full bg-rojo" />
      </h2>
      <Link href={href} className="ml-auto text-[0.7rem] uppercase tracking-wider font-bold text-rojo hover:opacity-70 transition-opacity">
        Ver todo →
      </Link>
    </div>
  );
}
