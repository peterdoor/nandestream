import Link from 'next/link';
import Image from 'next/image';
import { Nota } from '@/lib/types';
import { tiempoRelativo } from '@/lib/utils';

const CAT_COLORS: Record<string, string> = {
  actualidad:    'bg-azul',
  politica:      'bg-rojo',
  gobierno:      'bg-azul-claro',
  institucional: 'bg-tinta',
  opinion:       'bg-[#6B3F1A]',
  comunidad:     'bg-[#1A5C3A]',
  videos:        'bg-[#4A1A6B]',
  entrevistas:   'bg-[#1A4A5C]',
};

type Props = {
  nota: Nota;
  variant?: 'featured' | 'normal' | 'small' | 'horizontal';
};

export default function NewsCard({ nota, variant = 'normal' }: Props) {
  const color = CAT_COLORS[nota.categoria] ?? 'bg-azul';
  const href  = `/nota/${nota.slug}`;

  if (variant === 'small' || variant === 'horizontal') {
    return (
      <Link href={href} className="flex gap-3 group">
        <div className="relative w-24 h-16 flex-shrink-0 bg-gris-claro overflow-hidden rounded-sm">
          {nota.imagen_url ? (
            <Image src={nota.imagen_url} alt={nota.titulo} fill className="object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className={`w-full h-full ${color} opacity-70`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[0.6rem] uppercase tracking-wider font-bold text-rojo">{nota.categoria}</span>
          <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-azul transition-colors mt-0.5">
            {nota.titulo}
          </h4>
          <span className="text-[0.7rem] text-gris-medio mt-1 block">{tiempoRelativo(nota.fecha)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group flex flex-col bg-crema hover:bg-white transition-colors">
      {/* Imagen */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {nota.imagen_url ? (
          <Image
            src={nota.imagen_url}
            alt={nota.titulo}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full ${color} flex items-center justify-center`}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,0.15)">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
        )}
        <span className={`absolute top-2.5 left-2.5 ${color} text-white text-[0.58rem] uppercase tracking-wider font-bold px-2.5 py-1 rounded-sm`}>
          {nota.categoria}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className={`font-display font-bold leading-snug group-hover:text-azul transition-colors ${variant === 'featured' ? 'text-xl md:text-2xl' : 'text-base'}`}>
          {nota.titulo}
        </h3>
        {nota.bajada && (
          <p className="text-sm text-gray-500 leading-relaxed mt-2 line-clamp-2">{nota.bajada}</p>
        )}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gris-claro text-[0.7rem] text-gris-medio">
          <span>{nota.autor}</span>
          <span className="text-gris-claro">·</span>
          <span>{tiempoRelativo(nota.fecha)}</span>
        </div>
      </div>
    </Link>
  );
}
