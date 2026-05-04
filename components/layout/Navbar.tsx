'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIAS } from '@/lib/types';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Nav principal */}
      <nav className="sticky top-0 z-50 bg-crema/97 backdrop-blur border-b-2 border-rojo h-[62px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-azul rounded flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M4 4l16 8-16 8V4z"/>
              </svg>
            </div>
            <div className="leading-tight">
              <span className="block font-display font-bold text-lg text-azul tracking-tight">Ñande Stream</span>
              <span className="block text-[0.5rem] uppercase tracking-[0.2em] text-rojo font-semibold">Información Nacional</span>
            </div>
          </Link>

          {/* Menu desktop */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {CATEGORIAS.map(s => (
              <li key={s.value}>
                <Link
                  href={`/${s.value}`}
                  className="text-[0.75rem] font-medium uppercase tracking-wider px-3 py-2 rounded hover:bg-rojo hover:text-white transition-all text-tinta"
                >
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/quienes-somos"
                className="text-[0.75rem] font-medium uppercase tracking-wider px-3 py-2 rounded hover:bg-rojo hover:text-white transition-all text-tinta"
              >
                Quiénes somos
              </Link>
            </li>
            <li className="ml-2">
              <Link
                href="/en-vivo"
                className="flex items-center gap-2 bg-rojo text-white text-[0.72rem] font-bold uppercase tracking-wider px-4 py-2 rounded live-pulse"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                En vivo
              </Link>
            </li>
          </ul>

          {/* Hamburger mobile */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <span className="block w-5 h-0.5 bg-tinta" />
            <span className="block w-5 h-0.5 bg-tinta" />
            <span className="block w-5 h-0.5 bg-tinta" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-[200] bg-crema flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gris-claro">
            <span className="font-display font-bold text-azul text-lg">Ñande Stream</span>
            <button onClick={() => setOpen(false)} className="text-2xl text-tinta p-1" aria-label="Cerrar">✕</button>
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
              Quiénes somos
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
