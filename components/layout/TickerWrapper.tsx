import { getNotasRecientes, getConfig } from '@/lib/supabase';
import TickerClient from './TickerClient';

export default async function TickerWrapper() {
  const [notas, config] = await Promise.all([
    getNotasRecientes(10),
    getConfig(),
  ]);

  const items = [
    ...notas.map(n => ({ titulo: n.titulo, slug: n.slug })),
    ...(config.ticker_extra
      ? config.ticker_extra.split('·').map(s => ({ titulo: s.trim(), slug: '' })).filter(i => i.titulo)
      : []),
  ];

  return <TickerClient items={items} velocidad={config.ticker_velocidad ?? 25} />;
}
