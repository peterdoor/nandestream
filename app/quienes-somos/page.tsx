import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quiénes somos',
  description: 'Ñande Stream es un espacio digital de información, análisis y conversación pública sobre la actualidad nacional paraguaya.',
};

export default function QuienesSomosPage() {
  return (
    <div className="bg-crema min-h-screen">
      <div className="bg-azul py-12">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">El medio</p>
          <h1 className="font-display text-4xl text-white">Quiénes somos</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="prose-nota">
          <p className="text-xl leading-relaxed text-gray-600 mb-8 border-l-4 border-rojo pl-5">
            Ñande Stream es un espacio digital de información, análisis y conversación pública sobre la actualidad nacional, la gestión institucional, la comunidad y el desarrollo del Paraguay.
          </p>
          <h2>Nuestra misión</h2>
          <p>Nacimos con el propósito de construir un medio serio, audiovisual y accesible que refleje la realidad paraguaya con rigor periodístico y compromiso ciudadano. Creemos que una ciudadanía bien informada es la base de una democracia sólida.</p>
          <h2>Nuestros valores</h2>
          <p><strong>Democracia:</strong> Defensa irrestricta del sistema democrático y constitucional del Paraguay.</p>
          <p><strong>Participación ciudadana:</strong> Fomentamos el debate público y la participación cívica activa.</p>
          <p><strong>Identidad nacional:</strong> Valoramos la cultura guaraní, la tradición y la historia como pilares de nuestra nación.</p>
          <p><strong>Desarrollo:</strong> Apostamos por el crecimiento sostenible y el bienestar de todos los paraguayos.</p>
          <p><strong>Independencia:</strong> Nuestro único compromiso es con la verdad y con los ciudadanos.</p>
          <h2>Nuestro equipo</h2>
          <p>Somos un equipo de periodistas, comunicadores y profesionales comprometidos con la información de calidad. Trabajamos desde Asunción con cobertura nacional, apostando por el periodismo digital como herramienta de transformación social.</p>
          <h2>El nombre</h2>
          <p><strong>Ñande</strong> significa <em>nuestro</em> en guaraní. Ñande Stream es el stream de todos los paraguayos — un espacio de todos, para todos.</p>
        </div>
        <div className="mt-12 flex gap-4 flex-wrap">
          <Link href="/contacto" className="bg-rojo hover:bg-rojo-oscuro text-white font-semibold px-6 py-3 rounded transition-colors text-sm">Contacto</Link>
          <Link href="/publicidad" className="border border-azul text-azul hover:bg-azul hover:text-white font-semibold px-6 py-3 rounded transition-colors text-sm">Publicidad</Link>
        </div>
      </div>
    </div>
  );
}
