import { NextRequest, NextResponse } from 'next/server';

const FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSeLMMhscFu9kXKe_dZmxp__c670uj6NLoQbEYJEXAsiY9_DyA/formResponse';

const FIELDS: Record<string, string> = {
  titulo:     'entry.1802897952',
  bajada:     'entry.1627910435',
  cuerpo:     'entry.1192525268',
  imagen_url: 'entry.709868084',
  autor:      'entry.283947373',
  fecha:      'entry.1694504368',
  categoria:  'entry.684352751',
  video_url:  'entry.798481289',
  destacado:  'entry.23430662',
};

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const { titulo, bajada, cuerpo, imagen_url, autor, fecha, categoria, video_url, destacado } = body;

  if (!titulo || !cuerpo) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  const formData = new URLSearchParams();
  formData.append(FIELDS.titulo,     titulo.trim());
  formData.append(FIELDS.bajada,     bajada?.trim() ?? '');
  formData.append(FIELDS.cuerpo,     cuerpo.trim());
  formData.append(FIELDS.imagen_url, imagen_url?.trim() ?? '');
  formData.append(FIELDS.autor,      autor?.trim() || 'Redaccion Nande Stream');
  formData.append(FIELDS.fecha,      fecha || new Date().toISOString().split('T')[0]);
  formData.append(FIELDS.categoria,  categoria || 'actualidad');
  formData.append(FIELDS.video_url,  video_url?.trim() ?? '');
  formData.append(FIELDS.destacado,  destacado ? 'SI' : 'NO');

  try {
    await fetch(FORM_ACTION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'follow',
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Error enviando al form:', e);
    return NextResponse.json({ error: 'Error de red' }, { status: 500 });
  }
}
