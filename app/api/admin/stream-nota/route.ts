import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM = `Sos redactor de Ñande Stream, medio paraguayo. A partir de una transcripción o resumen de stream, generás contenido periodístico.

Respondé SOLO con JSON válido:
{
  "titulo": "titular periodístico",
  "bajada": "copete de 1-2 oraciones",
  "cuerpo": "nota completa en 4-5 párrafos",
  "seo_title": "título SEO",
  "meta_description": "descripción SEO",
  "post_facebook": "texto para Facebook (max 280 chars)",
  "post_twitter": "texto para X/Twitter (max 240 chars)",
  "mensaje_whatsapp": "mensaje informal para WhatsApp (max 300 chars, puede incluir emojis)"
}`;

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY no configurada' }, { status: 503 });
  }

  const { transcripcion, titulo_stream } = await req.json();
  if (!transcripcion?.trim()) {
    return NextResponse.json({ error: 'Falta la transcripción' }, { status: 400 });
  }

  const prompt = `${titulo_stream ? `Título del stream: "${titulo_stream}"\n\n` : ''}Transcripción/resumen:\n${transcripcion}`;

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: prompt },
        ],
        temperature: 0.65,
        max_tokens: 2500,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Error en la IA' }, { status: 500 });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? '';
    const clean = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: 'Formato inesperado. Intentá de nuevo.' }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (e) {
    console.error('Stream nota error:', e);
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 });
  }
}
