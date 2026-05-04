export type EstadoNota = 'borrador' | 'publicado' | 'programado' | 'archivado';

export type Nota = {
  id: string;
  titulo: string;
  bajada: string;
  cuerpo: string;
  imagen_url: string;
  autor: string;
  fecha: string;
  fecha_programada?: string;
  categoria: Categoria;
  video_url: string;
  destacado: boolean;
  estado: EstadoNota;
  slug: string;
  seo_title?: string;
  meta_description?: string;
  tags?: string;
  orden_portada?: number;
  created_at?: string;
};

export type Categoria =
  | 'actualidad'
  | 'politica'
  | 'opinion'
  | 'kachiai'
  | 'deportes';

export const CATEGORIAS: { value: Categoria; label: string; tono: string }[] = [
  { value: 'actualidad', label: 'Actualidad', tono: 'formal e informativo' },
  { value: 'politica',   label: 'Política',   tono: 'institucional y sobrio' },
  { value: 'opinion',    label: 'Opinión',    tono: 'editorial con perspectiva clara' },
  { value: 'kachiai',    label: 'Kachiai',    tono: 'suelto, coloquial, con humor paraguayo' },
  { value: 'deportes',   label: 'Deportes',   tono: 'datos primero, nunca inventar resultados' },
];

export const ESTADOS: { value: EstadoNota; label: string; color: string }[] = [
  { value: 'borrador',   label: 'Borrador',   color: 'bg-yellow-100 text-yellow-800' },
  { value: 'publicado',  label: 'Publicado',  color: 'bg-green-100 text-green-700' },
  { value: 'programado', label: 'Programado', color: 'bg-blue-100 text-blue-700' },
  { value: 'archivado',  label: 'Archivado',  color: 'bg-gray-100 text-gray-600' },
];
