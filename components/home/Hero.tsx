'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [playing, setPlaying] = useState(false);
  const streamId = process.env.NEXT_PUBLIC_YOUTUBE_LIVE_ID;

  return (
    <section className="bg-azul relative overflow-hidden min-h-[88vh] flex items-center">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,rgba(200,16,46,0.18),transparent_70%)]" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 grid grid-cols-6 opacity-[0.04]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-rojo'} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-rojo/20 border border-rojo/40 text-red-300 text-[0.68rem] uppercase tracking-[0.15em] font-bold px-4 py-2 rounded-sm mb-6">
              <span className="w-1.5 h-1.5 bg-rojo rounded-full live-pulse" />
              Transmisión en vivo
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[4rem] leading-[1.05] text-white mb-6">
              Información que{' '}
              <em className="not-italic text-acento">construye</em>{' '}
              el Paraguay
            </h1>

            <p className="text-white/65 text-lg leading-relaxed max-w-lg mb-8">
              Análisis, actualidad y conversación pública sobre la gestión institucional, la comunidad y el desarrollo nacional.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/en-vivo"
                className="flex items-center gap-2.5 bg-rojo hover:bg-rojo-oscuro text-white font-semibold px-7 py-3.5 rounded transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
                Ver en vivo
              </Link>
              <Link
                href="/actualidad"
                className="text-white/75 hover:text-white border border-white/25 hover:border-white/60 px-6 py-3.5 rounded transition-colors font-medium"
              >
                Últimas noticias →
              </Link>
            </div>
          </div>

          {/* Right — stream embed */}
          <div className="hidden lg:block">
            <div className="rounded-lg overflow-hidden border border-white/10 bg-black/40" style={{ aspectRatio: '16/9' }}>
              {playing && streamId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${streamId}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-azul to-black/70">
                  <span className="bg-rojo text-white text-[0.62rem] uppercase tracking-widest font-bold px-3 py-1.5 rounded-sm">
                    ● En vivo
                  </span>
                  <button
                    onClick={() => setPlaying(true)}
                    className="w-16 h-16 bg-rojo rounded-full flex items-center justify-center hover:scale-110 transition-transform live-pulse"
                    aria-label="Reproducir stream"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="white" className="ml-1">
                      <path d="M4 4l16 8-16 8V4z"/>
                    </svg>
                  </button>
                  <p className="text-white/60 text-sm text-center">
                    Haz clic para ver la transmisión en vivo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
