export type Nota = {
  id: string;
  titulo: string;
  bajada: string;
  cuerpo: string;
  imagen_url: string;
  autor: string;
  fecha: string;
  categoria: Categoria;
  video_url: string;
  destacado: boolean;
  slug: string;
};

export type Categoria =
  | 'actualidad'
  | 'politica'
  | 'gobierno'
  | 'institucional'
  | 'opinion'
  | 'comunidad'
  | 'videos'
  | 'entrevistas';

export const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'actualidad',   label: 'Actualidad' },
  { value: 'politica',     label: 'Política' },
  { value: 'gobierno',     label: 'Gobierno' },
  { value: 'institucional',label: 'Institucional' },
  { value: 'opinion',      label: 'Opinión' },
  { value: 'comunidad',    label: 'Comunidad' },
  { value: 'videos',       label: 'Videos' },
  { value: 'entrevistas',  label: 'Entrevistas' },
];
