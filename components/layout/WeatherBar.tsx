'use client';
import { useState, useEffect } from 'react';

type Ciudad = { ciudad: string; temp: number; icono: string };
type Cotizaciones = { usd_pyg: number; eur_pyg: number; brl_pyg: number; ars_pyg: number };

function formatPYG(n: number) {
  if (!n) return '—';
  return n.toLocaleString('es-PY');
}

export default function WeatherBar() {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [cotiz, setCotiz] = useState<Cotizaciones | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch('/api/weather').then(r => r.json()).then(setCiudades).catch(() => {});
    fetch('/api/cotizaciones').then(r => r.json()).then(setCotiz).catch(() => {});
  }, []);

  // Rotar ciudades cada 5 segundos
  useEffect(() => {
    if (ciudades.length < 2) return;
    const interval = setInterval(() => {
      setIdx(i => (i + 1) % ciudades.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ciudades.length]);

  const ciudad = ciudades[idx];

  if (!ciudad && !cotiz) return null;

  return (
    <div className="bg-tinta text-white/70 text-[0.7rem] font-mono border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4 overflow-hidden">
        {/* Clima */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {ciudad ? (
            <div className="flex items-center gap-1.5 transition-all">
              <span>{ciudad.icono}</span>
              <span className="text-white font-semibold">{ciudad.ciudad}</span>
              <span>{ciudad.temp}°C</span>
            </div>
          ) : (
            <span className="opacity-40">Cargando clima...</span>
          )}
          {/* Indicadores de ciudad */}
          {ciudades.length > 1 && (
            <div className="flex gap-1">
              {ciudades.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Divisor */}
        <div className="hidden md:block w-px h-3 bg-white/10 flex-shrink-0" />

        {/* Cotizaciones */}
        {cotiz && (
          <div className="hidden md:flex items-center gap-4 text-[0.68rem] flex-shrink-0">
            <span className="text-white/40 uppercase tracking-wider">Cotizaciones</span>
            {cotiz.usd_pyg > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-white/50">USD</span>
                <span className="text-white font-semibold">₲{formatPYG(cotiz.usd_pyg)}</span>
              </span>
            )}
            {cotiz.eur_pyg > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-white/50">EUR</span>
                <span className="text-white font-semibold">₲{formatPYG(cotiz.eur_pyg)}</span>
              </span>
            )}
            {cotiz.brl_pyg > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-white/50">BRL</span>
                <span className="text-white font-semibold">₲{formatPYG(cotiz.brl_pyg)}</span>
              </span>
            )}
            {cotiz.ars_pyg > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-white/50">ARS</span>
                <span className="text-white font-semibold">₲{formatPYG(cotiz.ars_pyg)}</span>
              </span>
            )}
          </div>
        )}

        {/* Mobile: cotizaciones resumidas */}
        {cotiz && cotiz.usd_pyg > 0 && (
          <div className="md:hidden flex items-center gap-2 text-[0.65rem] flex-shrink-0">
            <span className="text-white/50">USD</span>
            <span className="text-white font-semibold">₲{formatPYG(cotiz.usd_pyg)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
