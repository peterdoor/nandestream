import { getConfig } from '@/lib/supabase';

export const revalidate = 60;

export default async function EnVivoPage() {
  const config = await getConfig();
  const { youtube_live_id, stream_activo, programa_actual } = config;

  const embedSrc = youtube_live_id
    ? youtube_live_id.startsWith('UC')
      ? `https://www.youtube.com/embed/live_stream?channel=${youtube_live_id}&autoplay=1`
      : `https://www.youtube.com/embed/${youtube_live_id}?autoplay=1`
    : '';

  return (
    <div className="bg-tinta min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-5">
          {stream_activo ? (
            <span className="badge-live">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              En vivo
            </span>
          ) : (
            <span className="badge-offline">
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
              Fuera del aire
            </span>
          )}
          <h1 className="font-display text-xl text-white">Ñande Stream</h1>
          {programa_actual && (
            <span className="text-white/50 text-sm hidden md:block">— {programa_actual}</span>
          )}
        </div>

        <div className="rounded-lg overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
          {embedSrc ? (
            <iframe
              className="w-full h-full"
              src={embedSrc}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-azul to-black">
              <div className="w-14 h-14 border-2 border-white/15 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.25)">
                  <path d="M4 4l16 8-16 8V4z"/>
                </svg>
              </div>
              <p className="text-white/50 text-sm">Sin transmisión activa en este momento</p>
              <p className="text-white/30 text-xs">Seguinos en redes para saber cuándo empezamos</p>
            </div>
          )}
        </div>

        <p className="text-white/30 text-xs mt-4 text-center">
          También podés seguirnos en YouTube, Facebook y TikTok.
        </p>
      </div>
    </div>
  );
}
