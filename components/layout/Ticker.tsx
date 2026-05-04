'use client';
import { useState, useEffect, useRef } from 'react';

type Ciudad = { ciudad: string; abrev: string; temp: number; icono: string };
type Cotiz = { usd_pyg: number; eur_pyg: number; brl_pyg: number };

function fmt(n: number) {
  return n > 0 ? n.toLocaleString('es-PY') : '—';
}

export default function Ticker({ titulares }: { titulares: string[] }) {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [cotiz, setCotiz] = useState<Cotiz | null>(null);
  const [velocidad, setVelocidad] = useState(25);

  useEffect(() => {
    fetch('/api/weather').then(r => r.json()).then((data: Ciudad[]) => setCiudades(data)).catch(() => {});
    fetch('/api/cotizaciones').then(r => r.json()).then(setCotiz).catch(() => {});
    fetch('/api/config-publica').then(r => r.json()).then(d => {
      if (d.ticker_velocidad) setVelocidad(d.ticker_velocidad);
    }).catch(() => {});
  }, []);

  // Construir el contenido del ticker
  const partes: string[] = [];

  // Clima
  ciudades.forEach(c => {
    partes.push(`${c.icono} ${c.abrev} ${c.temp}°C`);
  });

  // Cotizaciones
  if (cotiz) {
    if (cotiz.usd_pyg > 0) partes.push(`USD ₲${fmt(cotiz.usd_pyg)}`);
    if (cotiz.eur_pyg > 0) partes.push(`EUR ₲${fmt(cotiz.eur_pyg)}`);
    if (cotiz.brl_pyg > 0) partes.push(`BRL ₲${fmt(cotiz.brl_pyg)}`);
  }

  // Separador
  if (partes.length > 0 && titulares.length > 0) {
    partes.push('◆ ÚLTIMA HORA');
  }

  // Noticias
  titulares.forEach(t => partes.push(t));

  const items = partes.length > 0 ? partes : ['Bienvenidos a Ñande Stream'];
  const all = [...items, ...items];

  return (
    <div className="bg-rojo text-white flex items-stretch overflow-hidden h-10 select-none">
      {/* Label fijo */}
      <div
        className="bg-[#9B0E23] flex items-center px-4 gap-2 flex-shrink-0"
        style={{ minWidth: 'fit-content' }}
      >
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse flex-shrink-0" />
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] whitespace-nowrap">
          En vivo
        </span>
      </div>

      {/* Cinta */}
      <div className="overflow-hidden flex items-center flex-1">
        <div
          className="flex whitespace-nowrap items-center gap-0"
          style={{
            animation: `ticker-scroll ${velocidad}s linear infinite`,
          }}
        >
          {all.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="text-[0.78rem] px-5">{item}</span>
              <span className="text-white/30 text-xs">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
