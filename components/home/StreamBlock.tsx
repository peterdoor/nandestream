'use client';
import { useState } from 'react';
import { SiteConfig } from '@/lib/supabase';
import Link from 'next/link';

export default function StreamBlock({ config }: { config: SiteConfig }) {
  const [playing, setPlaying] = useState(false);
  const { stream_activo, youtube_live_id, frase_hero, programa_actual, agenda } = config;

  return (
    <section className="bg-azul">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Player — 3/5 del ancho */}
          <div className="lg:col-span-3">
            {/* Badge estado */}
            <div className="flex items-center gap-3 mb-4">
              {stream_activo ? (
                <span className="badge-live">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  En vivo
                </span>
              ) : (
                <span className="badge-offline">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  Fuera del aire
                </span>
              )}
              {programa_actual && (
                <span className="text-white/60 text-sm">{programa_actual}</span>
              )}
            </div>

            {/* Player */}
            <div className="rounded-lg overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
              {playing && youtube_live_id ? (
                <iframe
                  className="w-full h-full"
                  src={
                    youtube_live_id.startsWith('UC')
                      ? `https://www.youtube.com/embed/live_stream?channel=${youtube_live_id}&autoplay=1`
                      : `https://www.youtube.com/embed/${youtube_live_id}?autoplay=1`
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-azul to-[#000820]">
                  {stream_activo && youtube_live_id ? (
                    <>
                      {/* Thumbnail de YouTube */}
                      <div
                        className="absolute inset-0 opacity-20 bg-cover bg-center"
                        style={{ backgroundImage: `url(https://img.youtube.com/vi/${youtube_live_id}/maxresdefault.jpg)` }}
                      />
                      <button
                        onClick={() => setPlaying(true)}
                        className="relative w-16 h-16 bg-rojo rounded-full flex items-center justify-center hover:scale-110 transition-transform live-pulse z-10"
                        aria-label="Ver en vivo"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                          <path d="M4 4l16 8-16 8V4z"/>
                        </svg>
                      </button>
                      <p className="relative text-white/70 text-sm z-10">Clic para ver la transmisión</p>
                    </>
                  ) : (
                    <div className="text-center px-8">
                      <div className="w-14 h-14 border-2 border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)">
                          <path d="M4 4l16 8-16 8V4z"/>
                        </svg>
                      </div>
                      <p className="text-white/50 text-sm">Sin transmisión activa</p>
                      <p className="text-white/30 text-xs mt-1">Seguinos en redes para enterarte cuando empezamos</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              {stream_activo && youtube_live_id && !playing && (
                <button
                  onClick={() => setPlaying(true)}
                  className="flex items-center gap-2 bg-rojo hover:bg-rojo-oscuro text-white font-bold px-6 py-3 rounded transition-colors text-sm live-pulse"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
                  Ver en vivo
                </button>
              )}
              <Link href="/en-vivo"
                className="flex items-center gap-2 border border-white/25 hover:border-white/50 text-white/75 hover:text-white font-medium px-5 py-3 rounded transition-colors text-sm">
                Ir a pantalla completa →
              </Link>
            </div>
          </div>

          {/* Info lateral — 2/5 del ancho */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Frase institucional */}
            <div>
              <p className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] mb-2">Ñande Stream</p>
              <h1 className="font-display text-2xl text-white leading-tight">
                {frase_hero}
              </h1>
            </div>

            {/* Agenda */}
            {agenda && (
              <div className="border-t border-white/10 pt-5">
                <p className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] mb-3">Próximos programas</p>
                <div className="flex flex-col gap-2">
                  {agenda.split('\n').filter(Boolean).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-rojo mt-0.5">▸</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Redes rápidas */}
            <div className="border-t border-white/10 pt-5">
              <p className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] mb-3">Seguinos</p>
              <div className="flex gap-2 flex-wrap">
                <SocialBtn href={process.env.NEXT_PUBLIC_YT ?? '#'} label="YouTube" color="bg-[#FF0000]" />
                <SocialBtn href={process.env.NEXT_PUBLIC_FB ?? '#'} label="Facebook" color="bg-[#1877F2]" />
                <SocialBtn href={process.env.NEXT_PUBLIC_WA ?? '#'} label="WhatsApp" color="bg-[#25D366]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function SocialBtn({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className={`${color} text-white text-xs font-semibold px-3 py-1.5 rounded hover:opacity-90 transition-opacity`}>
      {label}
    </a>
  );
}
