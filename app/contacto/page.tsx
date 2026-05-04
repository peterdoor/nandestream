import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponete en contacto con el equipo de Ñande Stream.',
};

export default function ContactoPage() {
  return (
    <div className="bg-crema min-h-screen">
      <div className="bg-azul py-12">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">El medio</p>
          <h1 className="font-display text-4xl text-white">Contacto</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-2xl text-tinta mb-6">Escribinos</h2>
            <div className="flex flex-col gap-5">
              <ContactCard
                icon="📧"
                titulo="Redacción"
                desc="Para enviar información, denuncias o consultas periodísticas."
                valor="redaccion@nandestream.com"
                link="mailto:redaccion@nandestream.com"
              />
              <ContactCard
                icon="📢"
                titulo="Publicidad"
                desc="Para consultas sobre espacios publicitarios y auspicios."
                valor="publicidad@nandestream.com"
                link="mailto:publicidad@nandestream.com"
              />
              <ContactCard
                icon="💬"
                titulo="WhatsApp"
                desc="Para enviar novedades, fotos o videos de último momento."
                valor="Escribinos al WhatsApp"
                link={process.env.NEXT_PUBLIC_WA ?? '#'}
              />
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl text-tinta mb-6">Redes sociales</h2>
            <div className="flex flex-col gap-4">
              <SocialCard color="bg-[#FF0000]" label="YouTube" desc="Suscribite al canal" href={process.env.NEXT_PUBLIC_YT ?? '#'} />
              <SocialCard color="bg-[#1877F2]" label="Facebook" desc="Seguinos en Facebook" href={process.env.NEXT_PUBLIC_FB ?? '#'} />
              <SocialCard color="bg-[#25D366]" label="WhatsApp" desc="Unite al grupo" href={process.env.NEXT_PUBLIC_WA ?? '#'} />
            </div>
            <div className="mt-8 bg-azul rounded-lg p-5">
              <p className="text-white font-semibold text-sm mb-1">¿Querés ser columnista?</p>
              <p className="text-white/60 text-xs leading-relaxed">Si tenés análisis, perspectiva y algo para decirle al Paraguay, escribinos a redaccion@nandestream.com con el asunto "Columnista".</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, titulo, desc, valor, link }: { icon: string; titulo: string; desc: string; valor: string; link: string }) {
  return (
    <a href={link} className="flex items-start gap-4 bg-white rounded-lg p-4 hover:shadow-md transition-shadow group">
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div>
        <p className="font-semibold text-sm text-tinta group-hover:text-azul transition-colors">{titulo}</p>
        <p className="text-xs text-gris-medio mt-0.5 mb-1">{desc}</p>
        <p className="text-xs text-rojo font-medium">{valor}</p>
      </div>
    </a>
  );
}

function SocialCard({ color, label, desc, href }: { color: string; label: string; desc: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 bg-white rounded-lg p-3.5 hover:shadow-md transition-shadow">
      <div className={`${color} w-8 h-8 rounded flex items-center justify-center flex-shrink-0`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
      </div>
      <div>
        <p className="font-semibold text-sm text-tinta">{label}</p>
        <p className="text-xs text-gris-medio">{desc}</p>
      </div>
    </a>
  );
}
