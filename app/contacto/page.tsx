import type { Metadata } from 'next';
import { getConfig } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contacto con el equipo de Nande Stream.',
};

export default async function ContactoPage() {
  const config = await getConfig();
  const wa = config.whatsapp_url || 'https://wa.me/595';

  return (
    <div className="bg-crema min-h-screen">
      <div className="bg-azul py-12">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">El medio</p>
          <h1 className="font-display text-4xl text-white">Contacto</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-14">
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          Escribinos por WhatsApp o por mail. Respondemos todas las consultas.
        </p>

        <div className="flex flex-col gap-4">
          {/* WhatsApp — principal */}
          <a href={wa} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-5 bg-[#25D366] text-white rounded-xl p-6 hover:opacity-95 transition-opacity group">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.523 5.858L.057 23.857a.5.5 0 0 0 .608.63l6.17-1.453A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.66-.52-5.17-1.427l-.36-.213-3.737.88.898-3.635-.234-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg">WhatsApp</p>
              <p className="text-white/80 text-sm mt-0.5">Canal principal — respondemos rapido</p>
            </div>
            <div className="ml-auto text-white/60 text-xl">→</div>
          </a>

          {/* Mail */}
          <a href="mailto:nandestream@gmail.com"
            className="flex items-center gap-5 bg-white rounded-xl p-6 border border-gris-claro hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-azul/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#002B7F" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-tinta">Email</p>
              <p className="text-rojo text-sm font-medium mt-0.5">nandestream@gmail.com</p>
            </div>
            <div className="ml-auto text-gris-medio text-xl">→</div>
          </a>

          {/* Columnistas */}
          <div className="bg-azul rounded-xl p-6 mt-2">
            <p className="text-white font-bold mb-1">Queres ser columnista?</p>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Si tenes analisis, perspectiva y algo para decirle al Paraguay, escribinos.
            </p>
            <a href={wa} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
