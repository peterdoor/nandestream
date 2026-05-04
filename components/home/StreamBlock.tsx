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

  // Cuando hay stream activo: embed del live
  // Cuando NO hay stream: embed del último video del canal (si hay channel ID)
  const getEmbedSrc = (autoplay = true) => {
    if (!youtube_live_id) return '';
    const ap = autoplay ? '&autoplay=1' : '';
    if (stream_activo) {
      return youtube_live_id.startsWith('UC')
        ? `https://www.youtube.com/embed/live_stream?channel=${youtube_live_id}${ap}&enablejsapi=1`
        : `https://www.youtube.com/embed/${youtube_live_id}${ap}&enablejsapi=1`;
    } else {
      // Último video del canal — YouTube lo sirve automáticamente
      if (youtube_live_id.startsWith('UC')) {
        return `https://www.youtube.com/embed?listType=user_uploads&list=${youtube_live_id}${ap}&enablejsapi=1`;
      }
      return '';
    }
  };

  const embedSrc = getEmbedSrc(true);
  const thumbUrl = youtube_live_id && !youtube_live_id.startsWith('UC')
    ? `https://img.youtube.com/vi/${youtube_live_id}/maxresdefault.jpg`
    : null;

  // Mutear principal cuando aparece mini
  useEffect(() => {
    if (!mainIframeRef.current) return;
    try {
      mainIframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: miniPlayer ? 'mute' : 'unMute', args: [] }), '*'
      );
    } catch {}
  }, [miniPlayer]);

  // Observer mini player
  useEffect(() => {
    if (!playing || miniClosed) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMiniPlayer(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [playing, miniClosed]);

  function handlePlay() { setPlaying(true); setMiniClosed(false); }

  function closeMini() {
    setMiniPlayer(false);
    setMiniClosed(true);
    try {
      mainIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*'
      );
    } catch {}
  }

  // ¿Mostrar player? Sí si hay stream activo O si hay channel ID (muestra último video)
  const showPlayer = stream_activo || (youtube_live_id?.startsWith('UC') && !stream_activo);

  return (
    <>
      <section className="bg-azul" ref={sectionRef}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Player */}
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
                    {showPlayer ? 'Último programa' : 'Fuera del aire'}
                  </span>
                )}
                {programa_actual && stream_activo && (
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
                ) : showPlayer ? (
                  /* Thumbnail con play */
                  <button onClick={handlePlay} className="relative w-full h-full block group" aria-label="Reproducir">
                    {thumbUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbUrl} alt="Video" className="w-full h-full object-cover"
                        onError={e => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-azul to-[#000820]" />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors" />
                    {stream_activo && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-rojo text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        En vivo
                      </div>
                    )}
                    {!stream_activo && (
                      <div className="absolute top-4 left-4 bg-black/50 text-white/80 text-xs px-3 py-1.5 rounded-sm">
                        Último programa
                      </div>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform ${stream_activo ? 'bg-rojo live-pulse' : 'bg-white/20 backdrop-blur'}`}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" className="ml-1.5">
                          <path d="M4 4l16 8-16 8V4z"/>
                        </svg>
                      </div>
                      <span className="text-white/80 text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full">
                        {stream_activo ? 'Tocá para ver la transmisión' : 'Ver último programa'}
                      </span>
                    </div>
                  </button>
                ) : (
                  /* Sin nada */
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
                {showPlayer && !playing && (
                  <button onClick={handlePlay}
                    className={`flex items-center gap-2 text-white font-bold px-6 py-3 rounded transition-colors text-sm ${stream_activo ? 'bg-rojo hover:bg-rojo-oscuro live-pulse' : 'bg-white/15 hover:bg-white/25'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
                    {stream_activo ? 'Ver en vivo' : 'Ver último programa'}
                  </button>
                )}
                <Link href="/en-vivo"
                  className="flex items-center gap-2 border border-white/25 hover:border-white/50 text-white/75 hover:text-white font-medium px-5 py-3 rounded transition-colors text-sm">
                  Pantalla completa →
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

      {/* MINI PLAYER — sin iframe, sin doble audio */}
      {playing && embedSrc && miniPlayer && (
        <div className="fixed bottom-5 right-5 z-[999] shadow-2xl rounded-lg overflow-hidden bg-black"
          style={{ width: '280px', aspectRatio: '16/9' }}>
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2.5 py-1.5 bg-black/70 z-10">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${stream_activo ? 'bg-rojo animate-pulse' : 'bg-white/50'}`} />
              <span className="text-white text-[0.62rem] font-bold uppercase tracking-wider">
                {stream_activo ? 'En vivo' : 'Reproduciendo'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/en-vivo" className="text-white/70 hover:text-white text-xs px-2 py-1 transition-colors" title="Pantalla completa">⛶</Link>
              <button onClick={closeMini} className="text-white/70 hover:text-white text-sm px-1.5 py-0.5 transition-colors">✕</button>
            </div>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-azul to-black gap-2 pt-6 relative">
            {thumbUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            )}
            <p className="relative text-white/60 text-xs">Reproduciendo en pantalla principal</p>
            <Link href="/en-vivo"
              className="relative inline-flex items-center gap-1.5 bg-rojo hover:bg-rojo-oscuro text-white text-xs font-bold px-3 py-1.5 rounded transition-colors">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
              Pantalla completa
            </Link>
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
