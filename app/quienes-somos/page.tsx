import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiénes somos',
  description: 'Ñande Stream es un espacio digital de información, análisis y conversación pública sobre la actualidad nacional paraguaya.',
};

export default function QuienesSomosPage() {
  return (
    <div className="bg-crema">
      {/* Hero */}
      <div className="bg-azul text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl mb-4">Quiénes somos</h1>
          <p className="text-white/65 text-lg leading-relaxed">
            Un espacio digital comprometido con la información veraz y el desarrollo del Paraguay.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="prose-nota">
          <p className="text-xl leading-relaxed text-gray-600 mb-8 border-l-4 border-rojo pl-5">
            Ñande Stream es un espacio digital de información, análisis y conversación pública sobre la actualidad nacional, la gestión institucional, la comunidad y el desarrollo del Paraguay.
          </p>

          <h2>Nuestra misión</h2>
          <p>
            Nacimos con el propósito de construir un medio serio, audiovisual y accesible que refleje la realidad paraguaya con rigor periodístico y compromiso ciudadano. Creemos que una ciudadanía bien informada es la base de una democracia sólida.
          </p>

          <h2>Nuestros valores</h2>
          <ul>
            <li><strong>Democracia:</strong> Defensa irrestricta del sistema democrático y constitucional del Paraguay.</li>
            <li><strong>Participación ciudadana:</strong> Fomentamos el debate público y la participación cívica activa.</li>
            <li><strong>Identidad nacional:</strong> Valoramos la cultura guaraní, la tradición y la historia como pilares de nuestra nación.</li>
            <li><strong>Desarrollo:</strong> Apostamos por el crecimiento sostenible y el bienestar de todos los paraguayos.</li>
            <li><strong>Independencia:</strong> Nuestro único compromiso es con la verdad y con los ciudadanos.</li>
          </ul>

          <h2>Nuestra cobertura</h2>
          <p>
            Cubrimos la actualidad nacional, la política, la gestión institucional, la economía, la comunidad y la cultura. A través de nuestras transmisiones en vivo, entrevistas y análisis buscamos ser un puente entre la información y los ciudadanos de todo el Paraguay.
          </p>
        </div>
      </div>
    </div>
  );
}
