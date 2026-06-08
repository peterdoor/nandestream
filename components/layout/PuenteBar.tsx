'use client';
import { useState, useEffect } from 'react';

type DirInfo = { mins: number; condicion: string; color: string } | null;
type PuenteData = { hacia_encarnacion: DirInfo; hacia_posadas: DirInfo; };

export default function PuenteBar() {
  const [data, setData] = useState<PuenteData | null>(null);
  const [hora, setHora] = useState('');

  useEffect(() => {
    fetch('/api/puente')
      .then(r => r.json())
      .then(d => {
        setData(d);
        const now = new Date();
        setHora(now.toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' }));
      })
      .catch(() => {});
  }, []);

  if (!data) return null;
  const { hacia_encarnacion, hacia_posadas } = data;
  if (!hacia_encarnacion && !hacia_posadas) return null;

  return (
    <div className="bg-[#0f172a] border-b border-white/8 text-white">
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex items-center min-h-[38px]">

          {/* Label */}
          <div className="bg-[#1e3a6e] flex items-center gap-2 px-3 self-stretch flex-shrink-0">
            <span className="text-sm">🚗</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-wider whitespace-nowrap">Puente</span>
          </div>

          {/* AR → PY (hacia Encarnación) */}
          {hacia_encarnacion && (
            <div className="flex items-center gap-2 px-4 border-r border-white/8 flex-shrink-0">
              <span className="text-[0.6rem] font-bold text-white/40 whitespace-nowrap">AR → PY</span>
              <span style={{ color: hacia_encarnacion.color }} className="text-sm font-bold whitespace-nowrap">
                {hacia_encarnacion.mins} min
              </span>
              <span className="text-[0.6rem] px-1.5 py-0.5 rounded whitespace-nowrap hidden sm:inline"
                style={{ background: hacia_encarnacion.color + '25', color: hacia_encarnacion.color }}>
                {hacia_encarnacion.condicion}
              </span>
            </div>
          )}

          {/* PY → AR (hacia Posadas) */}
          {hacia_posadas && (
            <div className="flex items-center gap-2 px-4 border-r border-white/8 flex-shrink-0">
              <span className="text-[0.6rem] font-bold text-white/40 whitespace-nowrap">PY → AR</span>
              <span style={{ color: hacia_posadas.color }} className="text-sm font-bold whitespace-nowrap">
                {hacia_posadas.mins} min
              </span>
              <span className="text-[0.6rem] px-1.5 py-0.5 rounded whitespace-nowrap hidden sm:inline"
                style={{ background: hacia_posadas.color + '25', color: hacia_posadas.color }}>
                {hacia_posadas.condicion}
              </span>
            </div>
          )}

          {/* Actualizado + powered by — solo desktop */}
          <div className="hidden md:flex flex-col justify-center px-4 ml-auto flex-shrink-0">
            {hora && <p className="text-[0.55rem] text-white/30 whitespace-nowrap">Actualizado: {hora}</p>}
            <a href="https://theaimanac.com/" target="_blank" rel="noopener noreferrer"
              className="text-[0.5rem] text-white/20 hover:text-white/40 transition-colors whitespace-nowrap">
              Powered by: theaimanac.com
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
