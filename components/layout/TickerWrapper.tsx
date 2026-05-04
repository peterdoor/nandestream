import { getNotasRecientes } from '@/lib/supabase';
import { getConfig } from '@/lib/supabase';
import Ticker from './Ticker';

export default async function TickerWrapper() {
  const [notas, config] = await Promise.all([
    getNotasRecientes(10),
    getConfig(),
  ]);

  const titulares = [
    ...notas.map(n => n.titulo),
    ...(config.ticker_extra ? config.ticker_extra.split('·').map(s => s.trim()).filter(Boolean) : []),
  ];

  return <Ticker titulares={titulares} />;
}
