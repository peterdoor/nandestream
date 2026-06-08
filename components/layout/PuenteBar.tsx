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
        {/* Una sola fila compacta en mobile y desktop */}
        <div className="flex items-center gap-0 min-h-[36px]">

          {/* Label compacto */}
          <div className="bg-[#1e3a6e] flex items-center gap-1.5 px-3 py-2 flex-shrink-0 self-stretch">
            <span className="text-sm">🚗</span>
            <div className="hidden sm:block">
              <p className="text-[0.6rem] font-bold uppercase tracking-wider leading-tight">Puente</p>
              <p className="text-[0.5rem] text-white/40 leading-tight">Posadas ↔ ENC</p>
            </div>
            <span className="sm:hidden text-[0.6rem] font-bold uppercase tracking-wider">Puente</span>
          </div>

          {/* Hacia Encarnación */}
          {hacia_encarnacion && (
            <div className="flex items-center gap-1.5 px-3 py-2 border-r border-white/8 flex-shrink-0">
              <span className="text-[0.55rem] text-white/35 hidden md:block">→ ENC</span>
              <span className="text-[0.55rem] text-white/35 md:hidden">→</span>
              <span style={{ color: hacia_encarnacion.color }} className="text-xs font-bold whitespace-nowrap">
                {hacia_encarnacion.mins} min
              </span>
              <span className="text-[0.55rem] px-1 py-0.5 rounded whitespace-nowrap hidden sm:inline"
                style={{ background: hacia_encarnacion.color + '22', color: hacia_encarnacion.color }}>
                {hacia_encarnacion.condicion}
              </span>
            </div>
          )}

          {/* Hacia Posadas */}
          {hacia_posadas && (
            <div className="flex items-center gap-1.5 px-3 py-2 border-r border-white/8 flex-shrink-0">
              <span className="text-[0.55rem] text-white/35 hidden md:block">← POS</span>
              <span className="text-[0.55rem] text-white/35 md:hidden">←</span>
              <span style={{ color: hacia_posadas.color }} className="text-xs font-bold whitespace-nowrap">
                {hacia_posadas.mins} min
              </span>
              <span className="text-[0.55rem] px-1 py-0.5 rounded whitespace-nowrap hidden sm:inline"
                style={{ background: hacia_posadas.color + '22', color: hacia_posadas.color }}>
                {hacia_posadas.condicion}
              </span>
            </div>
          )}

          {/* Actualizado + powered by — solo desktop */}
          <div className="hidden md:flex flex-col justify-center px-3 flex-shrink-0 ml-auto">
            {hora && <p className="text-[0.55rem] text-white/35 whitespace-nowrap">Actualizado: {hora}</p>}
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
