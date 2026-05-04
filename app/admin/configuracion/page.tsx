'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SiteConfig } from '@/lib/supabase';

const DEFAULT: SiteConfig = {
  frase_hero: 'Información que construye el Paraguay',
  youtube_live_id: '',
  stream_activo: false,
  ticker_extra: '',
  ticker_velocidad: 25,
  youtube_url: '',
  facebook_url: '',
  tiktok_url: '',
  instagram_url: '',
  whatsapp_url: '',
  agenda: '',
  programa_actual: '',
  rss_urls: '',
};

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT);
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [tab, setTab] = useState<'stream'|'redes'|'ticker'|'seo'>('stream');

  useEffect(() => {
    fetch('/api/admin/get-config').then(r => r.json()).then(d => setConfig({ ...DEFAULT, ...d })).catch(() => {});
  }, []);

  function set(key: keyof SiteConfig, value: string | boolean | number) {
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
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="font-display text-xl text-tinta mb-6">Configuración</h1>

        {status === 'ok' && <Alert type="ok">Guardado correctamente.</Alert>}
        {status === 'error' && <Alert type="error">Error al guardar.</Alert>}

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gris-claro mb-5">
          {(['stream', 'redes', 'ticker', 'seo'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-rojo text-rojo' : 'border-transparent text-gris-medio hover:text-tinta'}`}>
              {t === 'seo' ? 'Textos' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* STREAM */}
          {tab === 'stream' && (
            <>
              <Card title="Estado del stream">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => set('stream_activo', !config.stream_activo)}
                    className={`w-14 h-7 rounded-full relative transition-colors flex-shrink-0 ${config.stream_activo ? 'bg-rojo' : 'bg-gris-medio'}`}>
                    <span className={`absolute top-1.5 w-4 h-4 bg-white rounded-full shadow transition-all ${config.stream_activo ? 'left-8' : 'left-1.5'}`} />
                  </div>
                  <div>
                    <span className={`font-semibold text-sm ${config.stream_activo ? 'text-rojo' : 'text-gris-medio'}`}>
                      {config.stream_activo ? '● En vivo ahora' : 'Fuera del aire'}
                    </span>
                    <p className="text-xs text-gris-medio mt-0.5">Cambia el estado visible en el home</p>
                  </div>
                </label>
              </Card>
              <Card title="ID del stream de YouTube">
                <input type="text" value={config.youtube_live_id} onChange={e => set('youtube_live_id', e.target.value)}
                  placeholder="Ej: jfKfPfyJRdk"
                  className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white font-mono" />
                <p className="text-xs text-gris-medio mt-1">Solo el ID de YouTube, no la URL completa</p>
              </Card>
              <Card title="Programa actual">
                <input type="text" value={config.programa_actual} onChange={e => set('programa_actual', e.target.value)}
                  placeholder="Ej: Análisis político — edición del mediodía"
                  className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white" />
              </Card>
              <Card title="Agenda de programas">
                <textarea value={config.agenda} onChange={e => set('agenda', e.target.value)}
                  placeholder={"Lunes 20:00 — Debate político\nMiércoles 19:00 — Actualidad nacional\nViernes 18:00 — Entrevistas"}
                  rows={4}
                  className="w-full border border-gris-claro rounded px-3 py-2 text-sm focus:border-azul outline-none resize-none bg-white" />
                <p className="text-xs text-gris-medio mt-1">Un programa por línea. Aparece en el bloque de stream del home.</p>
              </Card>
            </>
          )}

          {/* REDES */}
          {tab === 'redes' && (
            <>
              {[
                { key: 'youtube_url',   label: 'YouTube',   ph: 'https://youtube.com/@nandestream' },
                { key: 'facebook_url',  label: 'Facebook',  ph: 'https://facebook.com/nandestream' },
                { key: 'tiktok_url',    label: 'TikTok',    ph: 'https://tiktok.com/@nandestream' },
                { key: 'instagram_url', label: 'Instagram', ph: 'https://instagram.com/nandestream' },
                { key: 'whatsapp_url',  label: 'WhatsApp',  ph: 'https://wa.me/595XXXXXXXXX' },
              ].map(r => (
                <Card key={r.key} title={r.label}>
                  <input type="url" value={config[r.key as keyof SiteConfig] as string}
                    onChange={e => set(r.key as keyof SiteConfig, e.target.value)}
                    placeholder={r.ph}
                    className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white" />
                </Card>
              ))}
            </>
          )}

          {/* TICKER */}
          {tab === 'ticker' && (
            <>
              <Card title="Velocidad del ticker">
                <div className="flex items-center gap-4">
                  <input type="range" min="10" max="60" value={config.ticker_velocidad}
                    onChange={e => set('ticker_velocidad', Number(e.target.value))}
                    className="flex-1" />
                  <span className="text-sm font-mono text-tinta w-16 text-right">{config.ticker_velocidad}s</span>
                </div>
                <p className="text-xs text-gris-medio mt-2">Menor número = más rápido. Recomendado: 20-30s</p>
              </Card>
              <Card title="Texto adicional en el ticker">
                <textarea value={config.ticker_extra} onChange={e => set('ticker_extra', e.target.value)}
                  placeholder="Seguinos en redes · Nuevo programa los lunes · nandestream.com"
                  rows={3}
                  className="w-full border border-gris-claro rounded px-3 py-2 text-sm focus:border-azul outline-none resize-none bg-white" />
                <p className="text-xs text-gris-medio mt-1">Separados por · (punto medio). Se agregan al final del ticker.</p>
              </Card>
            </>
          )}

          {/* TEXTOS / SEO */}
          {tab === 'seo' && (
            <Card title="Frase institucional del hero">
              <input type="text" value={config.frase_hero} onChange={e => set('frase_hero', e.target.value)}
                placeholder="Información que construye el Paraguay"
                className="w-full border border-gris-claro rounded px-3 py-2.5 text-sm focus:border-azul outline-none bg-white" />
            </Card>
          )}

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={status === 'loading'}
              className="px-8 py-3 bg-azul hover:bg-azul-claro text-white font-bold rounded transition-colors disabled:opacity-50 text-sm">
              {status === 'loading' ? 'Guardando...' : 'Guardar configuración'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-gris-medio mb-2.5">{title}</label>
      {children}
    </div>
  );
}

function Alert({ type, children }: { type: 'ok'|'error'; children: React.ReactNode }) {
  return (
    <div className={`px-4 py-3 rounded mb-4 text-sm font-medium ${type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
      {children}
    </div>
  );
}
