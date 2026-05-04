import Link from 'next/link';
import { CATEGORIAS } from '@/lib/types';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-tinta text-white/55 pt-12 pb-5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-rojo rounded-sm flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
              </div>
              <span className="font-display font-bold text-white text-base">Ñande Stream</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs mb-4">
              Canal paraguayo de streaming político e institucional. Información, análisis y conversación pública.
            </p>
            <div className="flex h-1.5 w-12 rounded overflow-hidden">
              <span className="flex-1 bg-rojo"/><span className="flex-1 bg-white/70"/><span className="flex-1 bg-azul"/>
            </div>
          </div>

          <div>
            <h4 className="text-white text-[0.7rem] uppercase tracking-widest font-bold mb-4 relative">
              Secciones
              <span className="absolute left-0 -bottom-2 w-4 h-0.5 bg-rojo"/>
            </h4>
            <ul className="flex flex-col gap-2">
              {CATEGORIAS.map(c => (
                <li key={c.value}>
                  <Link href={`/${c.value}`} className="text-xs hover:text-white transition-colors">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[0.7rem] uppercase tracking-widest font-bold mb-4 relative">
              El medio
              <span className="absolute left-0 -bottom-2 w-4 h-0.5 bg-rojo"/>
            </h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/quienes-somos" className="text-xs hover:text-white transition-colors">Quiénes somos</Link></li>
              <li><Link href="/politica-editorial" className="text-xs hover:text-white transition-colors">Política editorial</Link></li>
              <li><Link href="/contacto" className="text-xs hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/publicidad" className="text-xs hover:text-white transition-colors">Publicidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[0.7rem] uppercase tracking-widest font-bold mb-4 relative">
              Seguinos
              <span className="absolute left-0 -bottom-2 w-4 h-0.5 bg-rojo"/>
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'YouTube',   color: 'bg-[#FF0000]', href: process.env.NEXT_PUBLIC_YT },
                { label: 'Facebook',  color: 'bg-[#1877F2]', href: process.env.NEXT_PUBLIC_FB },
                { label: 'WhatsApp',  color: 'bg-[#25D366]', href: process.env.NEXT_PUBLIC_WA },
              ].map(r => (
                <a key={r.label} href={r.href ?? '#'} target="_blank" rel="noopener noreferrer"
                  className={`${r.color} text-white text-xs font-medium px-3 py-1.5 rounded w-fit opacity-80 hover:opacity-100 transition-opacity`}>
                  {r.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/25">
          <span>© {year} Ñande Stream · Asunción, Paraguay</span>
          <div className="flex items-center gap-3">
            <Link href="/politica-editorial" className="hover:text-white/50 transition-colors">Política editorial</Link>
            <span>·</span>
            <Link href="/contacto" className="hover:text-white/50 transition-colors">Contacto</Link>
            <span>·</span>
            <div className="flex h-2 w-4 rounded-sm overflow-hidden">
              <span className="flex-1 bg-rojo"/><span className="flex-1 bg-white/50"/><span className="flex-1 bg-azul"/>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
