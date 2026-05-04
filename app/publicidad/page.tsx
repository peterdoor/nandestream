import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Publicidad',
  description: 'Espacios publicitarios en Ñande Stream — llegá a miles de paraguayos.',
};

export default function PublicidadPage() {
  return (
    <div className="bg-crema min-h-screen">
      <div className="bg-azul py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">El medio</p>
          <h1 className="font-display text-4xl text-white mb-3">Publicidad</h1>
          <p className="text-white/60 text-lg">Conectá tu marca con miles de paraguayos.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-14">

        {/* Propuesta de valor */}
        <div className="bg-azul rounded-xl p-8 mb-10 text-white">
          <h2 className="font-display text-2xl mb-4">¿Por qué anunciarte en Ñande Stream?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: 'Audiencia comprometida', d: 'Lectores y espectadores activos interesados en la actualidad paraguaya.' },
              { n: 'Multiplataforma', d: 'Web, stream en vivo, YouTube, Facebook y WhatsApp en un solo paquete.' },
              { n: 'Contenido de calidad', d: 'Tu marca asociada a periodismo serio e institucional.' },
            ].map(i => (
              <div key={i.n} className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold text-sm mb-1">{i.n}</p>
                <p className="text-white/60 text-xs leading-relaxed">{i.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Espacios disponibles */}
        <h2 className="font-display text-2xl text-tinta mb-6">Espacios disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {[
            { titulo: 'Banner Destacadas', formato: 'Cuadrado / vertical', desc: 'Aparece a los costados de las noticias destacadas en la portada. Alto impacto visual.', badge: 'Portada' },
            { titulo: 'Banner Home', formato: 'Horizontal — 1200×120px', desc: 'Franja ancha entre secciones de la portada. Máxima visibilidad en la navegación.', badge: 'Portada' },
            { titulo: 'Banner Sidebar', formato: 'Cuadrado / rectangular', desc: 'Columna derecha en todas las páginas de notas. Acompaña la lectura.', badge: 'Notas' },
            { titulo: 'Mención en stream', formato: 'Audio + visual en vivo', desc: 'Mención durante la transmisión en vivo con pantalla de agradecimiento.', badge: 'Stream' },
          ].map(e => (
            <div key={e.titulo} className="bg-white rounded-lg p-5 border border-gris-claro">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-tinta">{e.titulo}</h3>
                <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-azul/10 text-azul px-2 py-1 rounded">{e.badge}</span>
              </div>
              <p className="text-xs text-rojo font-medium mb-2">{e.formato}</p>
              <p className="text-sm text-gris-medio leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gris-claro rounded-xl p-8 text-center">
          <h2 className="font-display text-2xl text-tinta mb-3">¿Te interesa anunciarte?</h2>
          <p className="text-gris-medio mb-6 text-sm">Escribinos y te enviamos nuestra propuesta comercial personalizada.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="mailto:publicidad@nandestream.com"
              className="bg-rojo hover:bg-rojo-oscuro text-white font-semibold px-8 py-3 rounded transition-colors text-sm">
              📧 publicidad@nandestream.com
            </a>
            <a href={process.env.NEXT_PUBLIC_WA ?? '#'} target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] hover:opacity-90 text-white font-semibold px-8 py-3 rounded transition-colors text-sm">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
