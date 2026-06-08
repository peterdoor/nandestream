import type { Metadata } from 'next';
import { getConfig } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Publicidad',
  description: 'Espacios publicitarios en Nande Stream.',
};

export default async function PublicidadPage() {
  const config = await getConfig();
  const wa = config.whatsapp_url || 'https://wa.me/595';

  return (
    <div className="bg-crema min-h-screen">
      <div className="bg-azul py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">El medio</p>
          <h1 className="font-display text-4xl text-white mb-3">Publicidad</h1>
          <p className="text-white/60 text-lg">Conecta tu marca con miles de paraguayos.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-14">

        {/* Propuesta de valor */}
        <div className="bg-azul rounded-xl p-8 mb-10">
          <h2 className="font-display text-2xl text-white mb-6">Por que anunciarte en Nande Stream?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { n: 'Audiencia comprometida', d: 'Lectores y espectadores activos interesados en la actualidad paraguaya.' },
              { n: 'Multiplataforma', d: 'Web, stream en vivo, YouTube, Facebook y WhatsApp en un solo paquete.' },
              { n: 'Contenido de calidad', d: 'Tu marca asociada a periodismo serio e institucional.' },
            ].map(i => (
              <div key={i.n} className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold text-white text-sm mb-1">{i.n}</p>
                <p className="text-white/60 text-xs leading-relaxed">{i.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Espacios */}
        <h2 className="font-display text-2xl text-tinta mb-6">Espacios disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            { titulo: 'Banner Destacadas', formato: 'Cuadrado / vertical', desc: 'A los costados de las noticias destacadas en portada. Alto impacto visual.', badge: 'Portada' },
            { titulo: 'Banner Home', formato: 'Horizontal — 1200x120px', desc: 'Franja ancha entre secciones de la portada. Maxima visibilidad.', badge: 'Portada' },
            { titulo: 'Banner Sidebar', formato: 'Cuadrado / rectangular', desc: 'Columna derecha en todas las paginas de notas. Acompana la lectura.', badge: 'Notas' },
            { titulo: 'Mencion en stream', formato: 'Audio + visual en vivo', desc: 'Mencion durante la transmision en vivo con pantalla de agradecimiento.', badge: 'Stream' },
          ].map(e => (
            <div key={e.titulo} className="bg-white rounded-xl p-5 border border-gris-claro">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-tinta">{e.titulo}</h3>
                <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-azul/10 text-azul px-2 py-1 rounded">{e.badge}</span>
              </div>
              <p className="text-xs text-rojo font-medium mb-2">{e.formato}</p>
              <p className="text-sm text-gris-medio leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA — todo al WhatsApp */}
        <div className="bg-gris-claro rounded-xl p-8 text-center">
          <h2 className="font-display text-2xl text-tinta mb-2">Te interesa anunciarte?</h2>
          <p className="text-gris-medio mb-8 text-sm">Escribinos por WhatsApp y te enviamos nuestra propuesta.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href={wa} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:opacity-90 text-white font-bold px-8 py-4 rounded-xl transition-opacity text-base">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.523 5.858L.057 23.857a.5.5 0 0 0 .608.63l6.17-1.453A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.66-.52-5.17-1.427l-.36-.213-3.737.88.898-3.635-.234-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Consultar por WhatsApp
            </a>
            <a href="mailto:nandestream@gmail.com"
              className="flex items-center gap-2 border-2 border-azul text-azul font-bold px-8 py-4 rounded-xl hover:bg-azul hover:text-white transition-colors text-base">
              nandestream@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
