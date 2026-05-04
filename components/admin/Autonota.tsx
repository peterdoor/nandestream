'use client';
import { useState } from 'react';

type Props = {
  onGenerar: (data: { titulo: string; bajada: string; cuerpo: string }) => void;
};

export default function Autonota({ onGenerar }: Props) {
  const [tema, setTema] = useState('');
  const [datos, setDatos] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  async function generar() {
    if (!tema.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/autonota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, datos }),
      });
      const data = await res.json();
      if (data.titulo) {
        onGenerar(data);
        setOpen(false);
        setTema('');
        setDatos('');
      } else {
        setError(data.error ?? 'Error al generar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-azul to-azul-claro text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
      >
        <span>✨</span>
        Generar con IA
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-azul/5 to-azul/10 border-2 border-azul/20 rounded-xl p-5 mb-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <h3 className="font-semibold text-tinta">Autonota — Generar con IA</h3>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="text-gris-medio hover:text-tinta transition-colors text-lg">✕</button>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gris-medio mb-1.5">
            Tema o titular de la nota *
          </label>
          <input
            type="text"
            value={tema}
            onChange={e => setTema(e.target.value)}
            placeholder="Ej: El gobierno anuncia plan de infraestructura vial para el Chaco"
            className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors bg-white"
            onKeyDown={e => e.key === 'Enter' && generar()}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gris-medio mb-1.5">
            Datos clave (opcional)
          </label>
          <textarea
            value={datos}
            onChange={e => setDatos(e.target.value)}
            placeholder="Ej: inversión de 500 millones, 3 departamentos beneficiados, inicio en 2026..."
            rows={2}
            className="w-full border-2 border-gris-claro rounded px-3 py-2 focus:border-azul outline-none text-sm transition-colors bg-white resize-none"
          />
          <p className="text-xs text-gris-medio mt-1">Cuantos más datos, mejor será la nota generada.</p>
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        <button
          type="button"
          onClick={generar}
          disabled={loading || !tema.trim()}
          className="bg-azul hover:bg-azul-claro text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generando nota...
            </>
          ) : (
            '✨ Generar nota'
          )}
        </button>
      </div>
    </div>
  );
}
