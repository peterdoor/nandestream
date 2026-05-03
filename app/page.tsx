import Hero from '@/components/home/Hero';
import NewsCard from '@/components/news/NewsCard';
import { getNotasDestacadas, getNotasByCategoria, getNotasRecientes } from '@/lib/sheets';
import Link from 'next/link';
import { CATEGORIAS } from '@/lib/types';

export const revalidate = 60;

export default async function HomePage() {
  const [destacadas, opinion, recientes] = await Promise.all([
    getNotasDestacadas(6),
    getNotasByCategoria('opinion'),
    getNotasRecientes(4),
  ]);

  const principal = destacadas[0];
  const secundarias = destacadas.slice(1, 4);
  const laterales = recientes.slice(0, 4);

  return (
    <>
      <Hero />

      {/* Noticias destacadas */}
      <section className="py-14 bg-crema">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Noticias destacadas" href="/actualidad" />

          {destacadas.length === 0 ? (
            <EmptyState mensaje="No hay notas publicadas aún. Cargá la primera desde el panel de administración." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gris-claro border border-gris-claro">
              {/* Principal */}
              {principal && (
                <div className="lg:row-span-2">
                  <NewsCard nota={principal} variant="featured" />
                </div>
              )}
              {/* Secundarias */}
              {secundarias.map(n => (
                <NewsCard key={n.id} nota={n} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Band institucional */}
      <BandInstitucional />

      {/* Opinión */}
      {opinion.length > 0 && (
        <section className="py-14 bg-gris-claro">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Opinión & Análisis" href="/opinion" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opinion.slice(0, 3).map(n => (
                <NewsCard key={n.id} nota={n} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Más noticias */}
      {laterales.length > 0 && (
        <section className="py-14 bg-crema">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Más noticias" href="/actualidad" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {laterales.map(n => (
                <NewsCard key={n.id} nota={n} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Secciones nav */}
      <div className="bg-gris-claro py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {CATEGORIAS.map(c => (
              <Link
                key={c.value}
                href={`/${c.value}`}
                className="flex flex-col items-center gap-1.5 py-3 px-2 bg-crema rounded text-[0.68rem] font-bold uppercase tracking-wide text-center hover:bg-azul hover:text-white transition-all"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quiénes somos */}
      <QuienesSomos />

      {/* Redes */}
      <Redes />
    </>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-7 border-b-2 border-gris-claro pb-3">
      <h2 className="font-display text-2xl relative">
        {title}
        <span className="absolute left-0 -bottom-[14px] h-0.5 w-full bg-rojo" />
      </h2>
      <Link href={href} className="ml-auto text-[0.72rem] uppercase tracking-wider font-bold text-rojo hover:opacity-70 transition-opacity">
        Ver todo →
      </Link>
    </div>
  );
}

function EmptyState({ mensaje }: { mensaje: string }) {
  return (
    <div className="border-2 border-dashed border-gris-claro rounded-lg p-16 text-center text-gris-medio">
      <p className="text-sm">{mensaje}</p>
    </div>
  );
}

function BandInstitucional() {
  const items = [
    { icon: '🏛️', title: 'Institucionalidad', desc: 'Respeto al Estado de Derecho y a las instituciones democráticas del Paraguay.' },
    { icon: '🤝', title: 'Comunidad',         desc: 'Una voz para los ciudadanos y comunidades de todo el territorio nacional.' },
    { icon: '📈', title: 'Desarrollo',         desc: 'Cobertura del crecimiento económico, social y humano del Paraguay.' },
    { icon: '🛡️', title: 'Periodismo serio',  desc: 'Información verificada, análisis profundo y perspectiva ciudadana.' },
  ];
  return (
    <div className="bg-azul py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map(item => (
          <div key={item.title} className="text-center text-white/80">
            <div className="text-3xl mb-3">{item.icon}</div>
            <strong className="block text-white font-semibold mb-1">{item.title}</strong>
            <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuienesSomos() {
  return (
    <section className="bg-tinta py-16 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[20vw] font-display font-black text-white/[0.03] leading-none pointer-events-none select-none">
        ÑS
      </div>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <h2 className="font-display text-3xl md:text-4xl text-white leading-tight mb-6">
            Un espacio para el{' '}
            <span className="text-acento">Paraguay</span> de hoy
          </h2>
          <p className="text-white/65 leading-relaxed mb-4">
            Ñande Stream es un espacio digital de información, análisis y conversación pública sobre la actualidad nacional, la gestión institucional, la comunidad y el desarrollo del Paraguay.
          </p>
          <p className="text-white/65 leading-relaxed mb-8">
            Nuestro compromiso es con la ciudadanía: ofrecer información rigurosa, análisis independiente y una plataforma donde la voz de todos los paraguayos encuentre eco.
          </p>
          <Link href="/quienes-somos" className="inline-flex items-center gap-2 bg-rojo hover:bg-rojo-oscuro text-white font-semibold px-7 py-3 rounded transition-colors">
            Conocer más →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { t: 'Democracia',    d: 'Defensa del sistema democrático y constitucional del Paraguay.' },
            { t: 'Participación', d: 'Fomentamos el debate ciudadano y la participación cívica.' },
            { t: 'Identidad',     d: 'Valoramos la cultura guaraní y la tradición nacional.' },
            { t: 'Desarrollo',    d: 'Apostamos por el crecimiento sostenible de todos los paraguayos.' },
          ].map(v => (
            <div key={v.t} className="bg-white/5 border-l-2 border-rojo p-4">
              <strong className="text-white block mb-1">{v.t}</strong>
              <p className="text-white/55 text-sm leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Redes() {
  const redes = [
    { label: 'YouTube',   env: 'NEXT_PUBLIC_YOUTUBE_URL',   color: 'bg-[#FF0000]' },
    { label: 'Facebook',  env: 'NEXT_PUBLIC_FACEBOOK_URL',  color: 'bg-[#1877F2]' },
    { label: 'TikTok',    env: 'NEXT_PUBLIC_TIKTOK_URL',    color: 'bg-black' },
    { label: 'Instagram', env: 'NEXT_PUBLIC_INSTAGRAM_URL', color: 'bg-gradient-to-r from-purple-600 via-red-500 to-yellow-400' },
    { label: 'WhatsApp',  env: 'NEXT_PUBLIC_WHATSAPP_URL',  color: 'bg-[#25D366]' },
  ];

  return (
    <div className="bg-crema py-12 text-center">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="font-display text-2xl mb-2">Seguinos en redes sociales</h3>
        <p className="text-gris-medio text-sm mb-7">Información en tiempo real desde todas nuestras plataformas.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {redes.map(r => (
            <a
              key={r.label}
              href={process.env[r.env] ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`${r.color} text-white font-semibold px-6 py-3 rounded text-sm hover:opacity-90 transition-opacity`}
            >
              {r.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
