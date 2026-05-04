import { getNotasRecientes } from '@/lib/supabase';

export default async function Ticker() {
  const notas = await getNotasRecientes(8);
  const items = notas.length > 0
    ? notas.map(n => n.titulo)
    : ['Bienvenidos a Ñande Stream', 'Información y análisis sobre la actualidad paraguaya'];

  const all = [...items, ...items];

  return (
    <div className="bg-rojo text-white flex items-stretch overflow-hidden h-11">
      <div className="bg-rojo-oscuro flex items-center px-5 text-[0.68rem] font-bold uppercase tracking-[0.15em] whitespace-nowrap gap-2 flex-shrink-0">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        Última hora
      </div>
      <div className="overflow-hidden flex items-center flex-1">
        <div className="ticker-inner flex gap-16 whitespace-nowrap text-[0.8rem]">
          {all.map((t, i) => (
            <span key={i} className="flex items-center gap-16">
              <span className="opacity-40">·</span>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
