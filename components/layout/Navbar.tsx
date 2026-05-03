'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIAS } from '@/lib/types';

const SECCIONES = CATEGORIAS.slice(0, 6);

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Topbar */}
      <div className="bg-azul text-white/70 text-[0.7rem] font-mono uppercase tracking-widest py-1.5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <TopbarDate />
          <div className="hidden md:flex gap-6">
            <Link href="/quienes-somos" className="hover:text-white transition-colors">Quiénes somos</Link>
            <Link href="#contacto" className="hover:text-white transition-colors">Contacto</Link>
            <Link href="#publicidad" className="hover:text-white transition-colors">Publicidad</Link>
          </div>
        </div>
      </div>

      {/* Nav principal */}
      <nav className="sticky top-0 z-50 bg-crema/95 backdrop-blur border-b-2 border-rojo h-[68px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-rojo rounded-full flex items-center justify-center">
              <PlayIcon />
            </div>
            <div className="leading-tight">
              <span className="block font-display font-bold text-xl text-azul">Ñande Stream</span>
              <span className="block text-[0.55rem] uppercase tracking-[0.15em] text-rojo font-semibold">Información Nacional</span>
            </div>
          </Link>

          {/* Menu desktop */}
          <ul className="hidden lg:flex items-center gap-1">
            {SECCIONES.map(s => (
              <li key={s.value}>
                <Link
                  href={`/${s.value}`}
                  className="text-[0.78rem] font-medium uppercase tracking-wider px-3 py-1.5 rounded hover:bg-rojo hover:text-white transition-all"
                >
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/en-vivo"
                className="flex items-center gap-2 bg-rojo text-white text-[0.78rem] font-bold uppercase tracking-wider px-4 py-2 rounded live-pulse ml-2"
              >
                <span className="w-2 h-2 bg-white rounded-full" />
                En vivo
              </Link>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <span className="block w-6 h-0.5 bg-tinta" />
            <span className="block w-6 h-0.5 bg-tinta" />
            <span className="block w-6 h-0.5 bg-tinta" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-[200] bg-crema flex flex-col p-6">
          <button className="self-end text-2xl mb-6" onClick={() => setOpen(false)}>✕</button>
          {CATEGORIAS.map(s => (
            <Link
              key={s.value}
              href={`/${s.value}`}
              onClick={() => setOpen(false)}
              className="text-lg font-medium py-3 border-b border-gris-claro"
            >
              {s.label}
            </Link>
          ))}
          <Link
            href="/en-vivo"
            onClick={() => setOpen(false)}
            className="mt-6 flex items-center gap-2 bg-rojo text-white font-bold uppercase tracking-wider px-4 py-3 rounded w-fit live-pulse"
          >
            <span className="w-2 h-2 bg-white rounded-full" />
            En vivo
          </Link>
        </div>
      )}
    </>
  );
}

function TopbarDate() {
  const days = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const now = new Date();
  return (
    <span>{days[now.getDay()]}, {now.getDate()} de {months[now.getMonth()]} de {now.getFullYear()}</span>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M4 4l16 8-16 8V4z"/>
    </svg>
  );
}
