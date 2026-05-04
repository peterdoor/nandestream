-- Ejecutar en Supabase SQL Editor

-- Agregar columnas nuevas a la tabla notas
alter table notas
  add column if not exists estado text default 'publicado',
  add column if not exists fecha_programada date,
  add column if not exists seo_title text default '',
  add column if not exists meta_description text default '',
  add column if not exists tags text default '',
  add column if not exists orden_portada integer default 0;

-- Tabla de RSS feeds para deportes
create table if not exists rss_feeds (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  url text not null,
  activo boolean default true,
  created_at timestamp with time zone default now()
);

-- Insertar feeds por defecto
insert into rss_feeds (nombre, url) values
  ('ABC Deportes', 'https://www.abc.com.py/rss/deportes.xml'),
  ('Última Hora Deportes', 'https://www.ultimahora.com/rss/deportes')
on conflict do nothing;

-- Tabla de items RSS importados
create table if not exists rss_items (
  id uuid default gen_random_uuid() primary key,
  feed_id uuid references rss_feeds(id),
  titulo text not null,
  bajada text,
  url_original text,
  imagen_url text,
  fecha_publicacion date,
  procesado boolean default false,
  created_at timestamp with time zone default now()
);

-- Índice para evitar duplicados
create unique index if not exists rss_items_url_idx on rss_items(url_original);

-- Agregar columnas a config
alter table config
  add column if not exists ticker_velocidad integer default 25,
  add column if not exists agenda text default '',
  add column if not exists programa_actual text default '',
  add column if not exists rss_urls text default '';
