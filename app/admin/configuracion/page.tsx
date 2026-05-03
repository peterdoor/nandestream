'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SiteConfig } from '@/lib/supabase';

const DEFAULT: SiteConfig = {
  frase_hero: 'Información que construye el Paraguay',
  youtube_live_id: '',
  stream_activo: false,
  ticker_extra: '',
  youtube_url: '',
  facebook_url: '',
  tiktok_url: '',
  instagram_url: '',
  whatsapp_url: '',
};

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/admin/get-config')
      .then(r => r.json())
      .then(d => setConfig({ ...DEFAULT, ...d }))
      .catch(() => {});
  }, []);

  function set(key: keyof SiteConfig, value: string | boolean) {
    setConfig(c => ({ ...c, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    setStatus(res.ok ? 'ok' : 'error');
    setTimeout(() => setStatus('idle'), 3000);
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="font-display text-2xl text-tinta mb-8">Configuración del sitio</h1>

        {status === 'ok' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded mb-6 text-sm font-medium">
            ✓ Configuración guardada correctamente.
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded mb-6 text-sm font-medium">
            ✗ Error al guardar. Intentá de nuevo.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Hero */}
          <Section title="🏠 Portada">
            <Field label="Frase institucional del hero">
              <input
                type="text"
                value={config.frase_hero}
                onChange={e => set('frase_hero', e.target.value)}
                className="input"
                placeholder="Información que construye el Paraguay"
              />
            </Field>
          </Section>

          {/* Stream */}
          <Section title="🔴 Stream en vivo">
            <Field label="Estado del stream">
              <label className="flex items-center gap-3 cursor-pointer mt-1">
                <div
                  onClick={() => set('stream_activo', !config.stream_activo)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.stream_activo ? 'bg-rojo' : 'bg-gris-medio'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${config.stream_activo ? 'left-7' : 'left-1'}`} />
                </div>
                <span className="text-sm font-medium">
                  {config.stream_activo ? '● En vivo ahora' : 'Sin transmisión activa'}
                </span>
              </label>
            </Field>
            <Field label="ID del stream de YouTube">
              <input
                type="text"
                value={config.youtube_live_id}
                onChange={e => set('youtube_live_id', e.target.value)}
                className="input"
                placeholder="Ej: jfKfPfyJRdk (solo el ID, no la URL completa)"
              />
              <p className="text-xs text-gris-medio mt-1">
                Está en la URL de YouTube: youtube.com/watch?v=<strong>ESTE_ES_EL_ID</strong>
              </p>
            </Field>
          </Section>

          {/* Ticker */}
          <Section title="📰 Ticker de noticias">
            <Field label="Texto adicional en el ticker (opcional)">
              <input
                type="text"
                value={config.ticker_extra}
                onChange={e => set('ticker_extra', e.target.value)}
                className="input"
                placeholder="Ej: Seguinos en redes sociales · Nuevo programa todos los lunes"
              />
              <p className="text-xs text-gris-medio mt-1">
                Se agrega al final del ticker automático de noticias.
              </p>
            </Field>
          </Section>

          {/* Redes */}
          <Section title="📱 Redes sociales">
            {[
              { key: 'youtube_url',   label: 'YouTube',   ph: 'https://youtube.com/@nandestream' },
              { key: 'facebook_url',  label: 'Facebook',  ph: 'https://facebook.com/nandestream' },
              { key: 'tiktok_url',    label: 'TikTok',    ph: 'https://tiktok.com/@nandestream' },
              { key: 'instagram_url', label: 'Instagram', ph: 'https://instagram.com/nandestream' },
              { key: 'whatsapp_url',  label: 'WhatsApp',  ph: 'https://wa.me/595XXXXXXXXX' },
            ].map(r => (
              <Field key={r.key} label={r.label}>
                <input
                  type="url"
                  value={config[r.key as keyof SiteConfig] as string}
                  onChange={e => set(r.key as keyof SiteConfig, e.target.value)}
                  className="input"
                  placeholder={r.ph}
                />
              </Field>
            ))}
          </Section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3 bg-azul hover:bg-azul-claro text-white font-bold rounded transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Guardando...' : '✓ Guardar configuración'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 2px solid #EDEAE4;
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus { border-color: #002B7F; }
      `}</style>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-gris-claro border-b border-gris-claro">
        <h2 className="font-semibold text-sm text-tinta">{title}</h2>
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gris-medio mb-1.5">{label}</label>
      {children}
    </div>
  );
}
