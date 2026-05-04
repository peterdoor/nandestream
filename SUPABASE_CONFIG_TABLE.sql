-- Ejecutar en Supabase SQL Editor
create table config (
  id integer primary key default 1,
  frase_hero text default 'Información que construye el Paraguay',
  youtube_live_id text default '',
  stream_activo boolean default false,
  ticker_extra text default '',
  youtube_url text default '',
  facebook_url text default '',
  tiktok_url text default '',
  instagram_url text default '',
  whatsapp_url text default ''
);

-- Insertar fila inicial
insert into config (id) values (1);
