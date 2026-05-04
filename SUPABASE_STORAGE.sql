-- Ejecutar en Supabase SQL Editor para habilitar el bucket de imágenes
insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true)
on conflict (id) do nothing;

-- Política: cualquiera puede ver las imágenes (público)
create policy "Imágenes públicas"
on storage.objects for select
using ( bucket_id = 'imagenes' );

-- Política: solo el servidor puede subir (via service key)
create policy "Solo servidor puede subir"
on storage.objects for insert
with check ( bucket_id = 'imagenes' );
