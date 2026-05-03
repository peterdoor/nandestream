import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const BUCKET = 'imagenes';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido. Usá JPG, PNG o WebP.' }, { status: 400 });
    }

    // Validar tamaño (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no puede superar los 5MB.' }, { status: 400 });
    }

    // Generar nombre único
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = await file.arrayBuffer();

    // Subir a Supabase Storage
    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${nombre}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
        body: buffer,
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error('Supabase Storage error:', err);
      return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
    }

    // URL pública
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${nombre}`;
    return NextResponse.json({ ok: true, url });

  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 });
  }
}
