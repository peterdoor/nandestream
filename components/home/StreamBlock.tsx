'use client';
import { useState, useEffect, useRef } from 'react';
import { SiteConfig } from '@/lib/supabase';
import Link from 'next/link';

export default function StreamBlock({ config }: { config: SiteConfig }) {
  const [playing, setPlaying] = useState(false);
  const [miniPlayer, setMiniPlayer] = useState(false);
  const [miniClosed, setMiniClosed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const mainIframeRef = useRef<HTMLIFrameElement>(null);

  const { stream_activo, youtube_live_id, frase_hero, programa_actual, agenda } = config;

  const embedSrc = youtube_live_id
    ? youtube_live_id.startsWith('UC')
      ? `https://www.youtube.com/embed/live_stream?channel=${youtube_live_id}&autoplay=1&enablejsapi=1`
      : `https://www.youtube.com/embed/${youtube_live_id}?autoplay=1&enablejsapi=1`
    : '';

  const thumbUrl = youtube_live_id && !youtube_live_id.startsWith('UC')
    ? `https://img.youtube.com/vi/${youtube_live_id}/maxresdefault.jpg`
    : null;

  // Cuando aparece el mini player, mutear el principal via postMessage
  useEffect(() => {
    if (!mainIframeRef.current) return;
    try {
      if (miniPlayer) {
        mainIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*'
        );
      } else {
        mainIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*'
        );
      }
    } catch {}
  }, [miniPlayer]);

  // Observer para detectar cuando el stream sale del viewport
  useEffect(() => {
    if (!playing || miniClosed) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMiniPlayer(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [playing, miniClosed]);

  function handlePlay() {
    setPlaying(true);
    setMiniClosed(false);
  }

  function closeMini() {
    setMiniPlayer(false);
    setMiniClosed(true);
    // Desmutear el principal cuando se cierra el mini
    try {
      mainIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*'
      );
    } catch {}
  }

  return (
    <>
      <section className="bg-azul" ref={sectionRef}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Player principal */}
            <div className="lg:col-span-3">
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

              <div className="rounded-lg overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
                {playing && embedSrc ? (
                  <iframe
                    ref={mainIframeRef}
                    className="w-full h-full"
                    src={embedSrc}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : stream_activo && youtube_live_id ? (
                  <button onClick={handlePlay} className="relative w-full h-full block group" aria-label="Ver stream en vivo">
                    {thumbUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbUrl} alt="Stream" className="w-full h-full object-cover"
                        onError={e => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-azul to-[#000820]" />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors" />
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-rojo text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      En vivo
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-rojo rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform live-pulse">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" className="ml-1.5">
                          <path d="M4 4l16 8-16 8V4z"/>
                        </svg>
                      </div>
                      <span className="text-white/80 text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full">
                        Tocá para ver la transmisión
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-azul to-[#000820]">
                    <div className="w-14 h-14 border-2 border-white/15 rounded-full flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.25)">
                        <path d="M4 4l16 8-16 8V4z"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-white/50 text-sm">Sin transmisión activa</p>
                      <p className="text-white/30 text-xs mt-1">Seguinos en redes para saber cuándo empezamos</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-4 flex-wrap">
                {stream_activo && youtube_live_id && !playing && (
                  <button onClick={handlePlay}
                    className="flex items-center gap-2 bg-rojo hover:bg-rojo-oscuro text-white font-bold px-6 py-3 rounded transition-colors text-sm live-pulse">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
                    Ver en vivo
                  </button>
                )}
                <Link href="/en-vivo"
                  className="flex items-center gap-2 border border-white/25 hover:border-white/50 text-white/75 hover:text-white font-medium px-5 py-3 rounded transition-colors text-sm">
                  Ir a pantalla completa →
                </Link>
              </div>
            </div>

            {/* Info lateral */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <p className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] mb-2">Ñande Stream</p>
                <h1 className="font-display text-2xl text-white leading-tight">{frase_hero}</h1>
              </div>
              {agenda && (
                <div className="border-t border-white/10 pt-5">
                  <p className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] mb-3">Próximos programas</p>
                  <div className="flex flex-col gap-2">
                    {agenda.split('\n').filter(Boolean).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="text-rojo mt-0.5 flex-shrink-0">▸</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

      {/* MINI PLAYER — solo muestra controles, el audio sigue en el principal (muteado) */}
      {playing && embedSrc && miniPlayer && (
        <div className="fixed bottom-5 right-5 z-[999] shadow-2xl rounded-lg overflow-hidden bg-black"
          style={{ width: '300px', aspectRatio: '16/9' }}>
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2.5 py-1.5 bg-black/70 z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-rojo rounded-full animate-pulse" />
              <span className="text-white text-[0.62rem] font-bold uppercase tracking-wider">En vivo</span>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/en-vivo" className="text-white/70 hover:text-white text-xs px-2 py-1 transition-colors" title="Pantalla completa">⛶</Link>
              <button onClick={closeMini} className="text-white/70 hover:text-white text-sm px-1.5 py-0.5 transition-colors" aria-label="Cerrar">✕</button>
            </div>
          </div>
          {/* Imagen de fondo en lugar de iframe — evita doble audio */}
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-azul to-black gap-3 pt-6">
            {thumbUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbUrl} alt="Stream" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            ) : null}
            <div className="relative z-10 text-center">
              <p className="text-white/70 text-xs mb-2">Reproduciendo en pantalla</p>
              <Link href="/en-vivo"
                className="inline-flex items-center gap-1.5 bg-rojo hover:bg-rojo-oscuro text-white text-xs font-bold px-4 py-2 rounded transition-colors">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
                Abrir en pantalla completa
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
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
