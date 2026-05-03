import Link from 'next/link';
import { CATEGORIAS } from '@/lib/types';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0D0D] text-white/60 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rojo rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
              </div>
              <div className="leading-tight">
                <span className="block font-display font-bold text-xl text-white">Ñande Stream</span>
                <span className="block text-[0.55rem] uppercase tracking-[0.15em] text-rojo font-semibold">Información Nacional</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Espacio digital de información, análisis y conversación pública sobre la actualidad nacional y el desarrollo del Paraguay.
            </p>
            {/* Bandera */}
            <div className="flex mt-5 h-1.5 w-14 rounded overflow-hidden">
              <span className="flex-1 bg-rojo" />
              <span className="flex-1 bg-white" />
              <span className="flex-1 bg-azul" />
            </div>
          </div>

          {/* Secciones */}
          <div>
            <h4 className="text-white text-[0.75rem] uppercase tracking-widest font-bold mb-5 relative">
              Secciones
              <span className="absolute left-0 -bottom-2 w-5 h-0.5 bg-rojo" />
            </h4>
            <ul className="flex flex-col gap-2">
              {CATEGORIAS.map(c => (
                <li key={c.value}>
                  <Link href={`/${c.value}`} className="text-sm text-white/50 hover:text-white transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* El medio */}
          <div>
            <h4 className="text-white text-[0.75rem] uppercase tracking-widest font-bold mb-5 relative">
              El medio
              <span className="absolute left-0 -bottom-2 w-5 h-0.5 bg-rojo" />
            </h4>
            <ul className="flex flex-col gap-2">
              {['Quiénes somos', 'Equipo editorial', 'Política editorial', 'Contacto', 'Publicidad'].map(item => (
                <li key={item}>
                  <Link href="/quienes-somos" className="text-sm text-white/50 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h4 className="text-white text-[0.75rem] uppercase tracking-widest font-bold mb-5 relative">
              Redes sociales
              <span className="absolute left-0 -bottom-2 w-5 h-0.5 bg-rejo" />
            </h4>
            <div className="flex flex-col gap-2">
              <SocialLink href={process.env.NEXT_PUBLIC_YOUTUBE_URL ?? '#'} label="YouTube" color="bg-[#FF0000]" />
              <SocialLink href={process.env.NEXT_PUBLIC_FACEBOOK_URL ?? '#'} label="Facebook" color="bg-[#1877F2]" />
              <SocialLink href={process.env.NEXT_PUBLIC_TIKTOK_URL ?? '#'} label="TikTok" color="bg-black" />
              <SocialLink href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#'} label="Instagram" color="bg-gradient-to-r from-purple-600 via-red-500 to-yellow-400" />
              <SocialLink href={process.env.NEXT_PUBLIC_WHATSAPP_URL ?? '#'} label="WhatsApp" color="bg-[#25D366]" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/30">
          <span>© {year} Ñande Stream · Asunción, Paraguay</span>
          <div className="flex items-center gap-2">
            <div className="flex h-2.5 w-5 rounded-sm overflow-hidden">
              <span className="flex-1 bg-rojo" />
              <span className="flex-1 bg-white/80" />
              <span className="flex-1 bg-azul" />
            </div>
            Hecho en Paraguay
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 text-white text-sm font-medium px-3 py-1.5 rounded ${color} opacity-80 hover:opacity-100 transition-opacity w-fit`}
    >
      {label}
    </a>
  );
}
