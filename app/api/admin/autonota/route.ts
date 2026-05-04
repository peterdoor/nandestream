import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIAS } from '@/lib/types';

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getSystemPrompt(categoria: string) {
  const cat = CATEGORIAS.find(c => c.value === categoria);
  const tono = cat?.tono ?? 'formal e informativo';

  return `Sos redactor del medio digital paraguayo "Ñande Stream". 
Estilo: ${tono}. Sobre Paraguay: actualidad, instituciones, desarrollo.
Sin tendencia partidaria. Sin inventar datos ni estadísticas.

Respondé SOLO con JSON válido, sin markdown ni texto extra:
{
  "titulo": "título periodístico (max 90 caracteres)",
  "bajada": "copete de 1-2 oraciones (max 180 caracteres)",
  "cuerpo": "nota completa en 4-6 párrafos separados por \\n\\n",
  "seo_title": "título SEO (max 60 caracteres)",
  "meta_description": "descripción SEO (max 155 caracteres)",
  "tags": "tag1, tag2, tag3"
}`;
}

// Evergreen topics por categoría
const EVERGREEN: Record<string, string[]> = {
  actualidad: [
    'Historia del sistema democrático paraguayo',
    'El rol del Congreso Nacional en Paraguay',
    'Cómo funciona el Poder Judicial en Paraguay',
    'Relaciones diplomáticas de Paraguay en el Mercosur',
  ],
  politica: [
    'Historia de la Constitución del Paraguay de 1992',
    'El sistema electoral paraguayo',
    'Partidos políticos históricos del Paraguay',
    'La figura del Presidente en el sistema constitucional',
  ],
  opinion: [
    'El futuro de la democracia paraguaya',
    'Desafíos del desarrollo económico nacional',
    'La importancia de la participación ciudadana',
  ],
  kachiai: [
    'Las fiestas patronales más importantes del Paraguay',
    'El tereré: historia y cultura de la bebida nacional',
    'Modismos y palabras del guaraní en el habla cotidiana',
    'Los mitos y leyendas del Paraguay',
  ],
  deportes: [
    'Historia del fútbol paraguayo',
    'Los campeones olímpicos paraguayos',
    'El béisbol en el Paraguay',
  ],
};

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY no configurada' }, { status: 503 });
  }

  const body = await req.json();
  const { tema, datos, categoria = 'actualidad', modo } = body;

  // Modo evergreen: devolver sugerencias
  if (modo === 'evergreen') {
    const sugerencias = EVERGREEN[categoria] ?? EVERGREEN.actualidad;
    return NextResponse.json({ sugerencias });
  }

  if (!tema?.trim()) {
    return NextResponse.json({ error: 'Falta el tema' }, { status: 400 });
  }

  const prompt = `Generá una nota periodística sobre: "${tema}"${datos ? `\n\nDatos: ${datos}` : ''}`;

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
          { role: 'system', content: getSystemPrompt(categoria) },
          { role: 'user', content: prompt },
        ],
        temperature: categoria === 'kachiai' ? 0.85 : 0.65,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Groq error:', err);
      return NextResponse.json({ error: 'Error en el servicio de IA' }, { status: 500 });
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

    if (!parsed.titulo || !parsed.cuerpo) {
      return NextResponse.json({ error: 'Respuesta incompleta.' }, { status: 500 });
    }

    return NextResponse.json({
      titulo:           parsed.titulo,
      bajada:           parsed.bajada ?? '',
      cuerpo:           parsed.cuerpo,
      seo_title:        parsed.seo_title ?? parsed.titulo.slice(0, 60),
      meta_description: parsed.meta_description ?? parsed.bajada ?? '',
      tags:             parsed.tags ?? '',
    });

  } catch (e) {
    console.error('Autonota error:', e);
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 });
  }
}
