'use client';
import { useState } from 'react';

export default function EnVivoPage() {
  const [playing, setPlaying] = useState(false);
  const streamId = process.env.NEXT_PUBLIC_YOUTUBE_LIVE_ID;

  return (
    <div className="bg-tinta min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center gap-2 bg-rojo text-white text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-sm live-pulse">
            <span className="w-2 h-2 bg-white rounded-full" />
            En vivo
          </span>
          <h1 className="font-display text-2xl text-white">Ñande Stream</h1>
        </div>

        <div className="rounded-lg overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
          {playing && streamId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${streamId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-azul to-black">
              <p className="text-white/50 text-sm">
                {streamId ? 'Stream disponible' : 'Sin transmisión activa en este momento'}
              </p>
              {streamId && (
                <button
                  onClick={() => setPlaying(true)}
                  className="w-20 h-20 bg-rojo rounded-full flex items-center justify-center hover:scale-110 transition-transform live-pulse"
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white" className="ml-1.5">
                    <path d="M4 4l16 8-16 8V4z"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-white/40 text-sm mt-4 text-center">
          También podés seguirnos en YouTube, Facebook y TikTok.
        </p>
      </div>
    </div>
  );
}
