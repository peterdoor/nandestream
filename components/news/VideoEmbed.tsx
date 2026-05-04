'use client';
import { useState } from 'react';

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function VideoEmbed({ url, titulo }: { url: string; titulo: string }) {
  const [error, setError] = useState(false);
  const videoId = getYouTubeId(url);

  if (!videoId) return null;

  const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  if (error) {
    return (
      <a href={watchUrl} target="_blank" rel="noopener noreferrer"
        className="relative block rounded overflow-hidden group" style={{ aspectRatio: '16/9' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbUrl} alt={titulo} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 group-hover:bg-black/60 transition-colors">
          <div className="w-14 h-14 bg-rojo rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
          </div>
          <span className="text-white font-semibold text-sm bg-black/40 px-4 py-2 rounded">
            Mirar en YouTube →
          </span>
        </div>
      </a>
    );
  }

  return (
    <div className="rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        allowFullScreen
        onError={() => setError(true)}
      />
    </div>
  );
}
