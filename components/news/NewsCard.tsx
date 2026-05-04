import Link from 'next/link';
import Image from 'next/image';
import { Nota } from '@/lib/types';
import { tiempoRelativo } from '@/lib/utils';

const CAT_COLORS: Record<string, string> = {
  actualidad: 'bg-azul',
  politica:   'bg-[#1A3FA0]',
  opinion:    'bg-tinta',
  kachiai:    'bg-rojo',
  deportes:   'bg-[#1A5C3A]',
};

type Props = {
  nota: Nota;
  variant?: 'featured' | 'normal' | 'small';
};

export default function NewsCard({ nota, variant = 'normal' }: Props) {
  const color = CAT_COLORS[nota.categoria] ?? 'bg-azul';
  const href = `/nota/${nota.slug}`;

  if (variant === 'small') {
    return (
      <Link href={href} className="flex gap-3 group">
        <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden rounded-sm bg-gris-claro">
          {nota.imagen_url ? (
            <Image src={nota.imagen_url} alt={nota.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className={`w-full h-full ${color} opacity-70`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[0.58rem] uppercase tracking-wider font-bold text-rojo">{nota.categoria}</span>
          <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-azul transition-colors mt-0.5 text-tinta">
            {nota.titulo}
          </h4>
          <span className="text-[0.65rem] text-gris-medio mt-1 block">{tiempoRelativo(nota.fecha)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group flex flex-col bg-crema hover:bg-white transition-colors h-full">
      {/* Imagen */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: '16/9' }}>
        {nota.imagen_url ? (
          <Image
            src={nota.imagen_url}
            alt={nota.titulo}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full ${color} flex items-center justify-center`}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="rgba(255,255,255,0.15)">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
        )}
        <span className={`absolute top-2.5 left-2.5 ${color} text-white text-[0.55rem] uppercase tracking-wider font-bold px-2 py-1 rounded-sm`}>
          {nota.categoria}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className={`font-display font-bold leading-snug group-hover:text-azul transition-colors text-tinta ${variant === 'featured' ? 'text-xl md:text-2xl' : 'text-base'}`}>
          {nota.titulo}
        </h3>
        {nota.bajada && variant === 'featured' && (
          <p className="text-sm text-gray-500 leading-relaxed mt-2 line-clamp-2">{nota.bajada}</p>
        )}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gris-claro text-[0.68rem] text-gris-medio">
          <span className="truncate">{nota.autor}</span>
          <span className="text-gris-claro flex-shrink-0">·</span>
          <span className="flex-shrink-0">{tiempoRelativo(nota.fecha)}</span>
        </div>
      </div>
    </Link>
  );
}
