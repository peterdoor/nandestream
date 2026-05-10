'use client';
import { useState, useEffect } from 'react';

type DirInfo = { mins: number; condicion: string; color: string } | null;

type PuenteData = {
  hacia_encarnacion: DirInfo;
  hacia_posadas: DirInfo;
};

export default function PuenteBar() {
  const [data, setData] = useState<PuenteData | null>(null);

  useEffect(() => {
    fetch('/api/puente')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return null;

  const { hacia_encarnacion, hacia_posadas } = data;
  if (!hacia_encarnacion && !hacia_posadas) return null;

  return (
    <div className="bg-[#0f172a] border-b border-white/8 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-stretch flex-wrap md:flex-nowrap">

          {/* Label */}
          <div className="bg-[#1e3a6e] flex items-center gap-2 px-4 py-2 flex-shrink-0">
            <span className="text-base">🚗</span>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-white">Puente Internacional</p>
              <p className="text-[0.58rem] text-white/50">Posadas ↔ Encarnación</p>
            </div>
          </div>

          {/* Hacia Encarnación */}
          {hacia_encarnacion && (
            <div className="flex items-center gap-3 px-5 py-2 border-r border-white/8 flex-1">
              <div>
                <p className="text-[0.58rem] text-white/40 uppercase tracking-wider mb-0.5">→ Encarnación</p>
                <div className="flex items-center gap-2">
                  <span style={{ color: hacia_encarnacion.color }} className="text-sm font-bold">
                    {hacia_encarnacion.mins} min
                  </span>
                  <span className="text-[0.6rem] px-1.5 py-0.5 rounded"
                    style={{ background: hacia_encarnacion.color + '22', color: hacia_encarnacion.color }}>
                    {hacia_encarnacion.condicion}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hacia Posadas */}
          {hacia_posadas && (
            <div className="flex items-center gap-3 px-5 py-2 flex-1">
              <div>
                <p className="text-[0.58rem] text-white/40 uppercase tracking-wider mb-0.5">← Posadas</p>
                <div className="flex items-center gap-2">
                  <span style={{ color: hacia_posadas.color }} className="text-sm font-bold">
                    {hacia_posadas.mins} min
                  </span>
                  <span className="text-[0.6rem] px-1.5 py-0.5 rounded"
                    style={{ background: hacia_posadas.color + '22', color: hacia_posadas.color }}>
                    {hacia_posadas.condicion}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actualización */}
          <div className="hidden md:flex items-center px-4 text-[0.6rem] text-white/25 flex-shrink-0">
            Se actualiza cada 2 horas
          </div>

        </div>
      </div>
    </div>
  );
}
