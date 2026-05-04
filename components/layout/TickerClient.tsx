'use client';
import Link from 'next/link';

type Item = { titulo: string; slug: string };

export default function TickerClient({ items, velocidad }: { items: Item[]; velocidad: number }) {
  const all = [...items, ...items]; // duplicar para loop continuo

  if (!items.length) return null;

  return (
    <div className="bg-rojo text-white flex items-stretch overflow-hidden h-10 select-none">
      <div className="bg-rojo-oscuro flex items-center px-4 gap-2 flex-shrink-0">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse flex-shrink-0" />
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] whitespace-nowrap">En vivo</span>
      </div>
      <div className="overflow-hidden flex items-center flex-1">
        <div
          className="flex whitespace-nowrap items-center"
          style={{ animation: `ticker-scroll ${velocidad}s linear infinite` }}
        >
          {all.map((item, i) => (
            <span key={i} className="flex items-center">
              {item.slug ? (
                <Link
                  href={`/nota/${item.slug}`}
                  className="text-[0.78rem] px-5 hover:text-white/80 transition-colors cursor-pointer"
                >
                  {item.titulo}
                </Link>
              ) : (
                <span className="text-[0.78rem] px-5">{item.titulo}</span>
              )}
              <span className="text-white/30 text-xs">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
