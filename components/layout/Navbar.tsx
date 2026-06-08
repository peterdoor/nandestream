'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIAS } from '@/lib/types';

const LOGO_ICONO = 'https://vtyaetjeeitviczwzink.supabase.co/storage/v1/object/public/imagenes/nande-logoreducido01.png';

type Props = {
  youtubeUrl?: string;
  whatsappUrl?: string;
};

export default function Navbar({ youtubeUrl, whatsappUrl }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-crema/97 backdrop-blur border-b-2 border-rojo h-[62px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
              <Image src={LOGO_ICONO} alt="Nande Stream" width={36} height={36} className="object-contain" />
            </div>
            <div className="leading-tight">
              <span className="block font-display font-bold text-lg text-azul tracking-tight">Nande Stream</span>
              <span className="block text-[0.5rem] uppercase tracking-[0.2em] text-rojo font-semibold">Informacion Nacional</span>
            </div>
          </Link>

          <ul className="hidden lg:flex items-center gap-0.5">
            {CATEGORIAS.map(s => (
              <li key={s.value}>
                <Link href={`/${s.value}`}
                  className="text-[0.75rem] font-medium uppercase tracking-wider px-3 py-2 rounded hover:bg-rojo hover:text-white transition-all text-tinta">
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/quienes-somos"
                className="text-[0.75rem] font-medium uppercase tracking-wider px-3 py-2 rounded hover:bg-rojo hover:text-white transition-all text-tinta">
                Quienes somos
              </Link>
            </li>
            {whatsappUrl && (
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[0.75rem] font-medium uppercase tracking-wider px-3 py-2 rounded hover:bg-[#25D366] hover:text-white transition-all text-tinta">
                  WhatsApp
                </a>
              </li>
            )}
            <li className="ml-2">
              <Link href="/en-vivo"
                className="flex items-center gap-2 bg-rojo text-white text-[0.72rem] font-bold uppercase tracking-wider px-4 py-2 rounded live-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                En vivo
              </Link>
            </li>
          </ul>

          <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <span className="block w-5 h-0.5 bg-tinta" />
            <span className="block w-5 h-0.5 bg-tinta" />
            <span className="block w-5 h-0.5 bg-tinta" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[200] bg-crema flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gris-claro">
            <div className="flex items-center gap-2">
              <Image src={LOGO_ICONO} alt="Nande Stream" width={32} height={32} className="object-contain" />
              <span className="font-display font-bold text-azul text-lg">Nande Stream</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-2xl text-tinta p-1">✕</button>
          </div>
          <div className="flex flex-col p-4 gap-1">
            <Link href="/en-vivo" onClick={() => setOpen(false)}
              className="flex items-center gap-2 bg-rojo text-white font-bold uppercase tracking-wider px-4 py-3 rounded mb-3 live-pulse w-fit">
              <span className="w-2 h-2 bg-white rounded-full" />
              En vivo
            </Link>
            {CATEGORIAS.map(s => (
              <Link key={s.value} href={`/${s.value}`} onClick={() => setOpen(false)}
                className="text-base font-medium py-3 px-2 border-b border-gris-claro text-tinta">
                {s.label}
              </Link>
            ))}
            <Link href="/quienes-somos" onClick={() => setOpen(false)}
              className="text-base font-medium py-3 px-2 border-b border-gris-claro text-tinta">
              Quienes somos
            </Link>
            {youtubeUrl && (
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
                className="text-base font-medium py-3 px-2 border-b border-gris-claro text-[#FF0000]">
                YouTube
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="text-base font-medium py-3 px-2 border-b border-gris-claro text-[#25D366]">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
