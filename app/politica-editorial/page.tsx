import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política editorial',
  description: 'Los principios que guían el trabajo periodístico de Ñande Stream.',
};

export default function PoliticaEditorialPage() {
  return (
    <div className="bg-crema min-h-screen">
      <div className="bg-azul py-12">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">El medio</p>
          <h1 className="font-display text-4xl text-white">Política editorial</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="prose-nota">
          <p className="text-xl leading-relaxed text-gray-600 mb-8 border-l-4 border-rojo pl-5">
            Ñande Stream se rige por principios de rigor periodístico, independencia editorial y compromiso con la ciudadanía paraguaya.
          </p>
          <h2>Independencia</h2>
          <p>Ñande Stream es un medio independiente. No responde a intereses partidarios, empresariales ni gubernamentales. Nuestras decisiones editoriales se basan exclusivamente en el valor informativo y el interés público.</p>
          <h2>Verificación</h2>
          <p>Toda información publicada en Ñande Stream es verificada antes de su difusión. Consultamos fuentes primarias, buscamos la versión de todos los involucrados y distinguimos claramente entre hechos y opiniones.</p>
          <h2>Correcciones</h2>
          <p>Cuando cometemos errores, los corregimos de manera transparente. Las correcciones se publican en la misma nota con una nota aclaratoria visible.</p>
          <h2>Opinión</h2>
          <p>Las notas de opinión representan el punto de vista de sus autores y no necesariamente la línea editorial del medio. Se identifican claramente como opinión.</p>
          <h2>Privacidad y fuentes</h2>
          <p>Protegemos la identidad de las fuentes que así lo soliciten. Nunca publicamos información que pueda poner en riesgo la integridad física de ninguna persona.</p>
          <h2>Publicidad</h2>
          <p>La publicidad y el contenido periodístico son estrictamente independientes. Los auspiciantes no tienen influencia sobre la cobertura editorial. El contenido publicitario está claramente identificado como tal.</p>
          <h2>Conflicto de intereses</h2>
          <p>Los periodistas y colaboradores de Ñande Stream no pueden cubrir temas en los que tengan interés personal o económico directo.</p>
        </div>
      </div>
    </div>
  );
}
