'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Contraseña incorrecta');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-azul flex items-center justify-center px-4">
      <div className="bg-crema rounded-lg p-8 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-rojo rounded-full flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
          </div>
          <div className="leading-tight">
            <span className="block font-display font-bold text-lg text-azul">Ñande Stream</span>
            <span className="block text-[0.55rem] uppercase tracking-[0.15em] text-rojo font-semibold">Panel de administración</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-tinta mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-gris-claro rounded px-4 py-2.5 text-tinta focus:outline-none focus:border-azul transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-rojo text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-rojo hover:bg-rojo-oscuro text-white font-semibold py-3 rounded transition-colors disabled:opacity-60"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
