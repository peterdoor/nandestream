import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `Sos un redactor periodístico del medio digital paraguayo "Ñande Stream". 
Tu estilo es serio, institucional y profesional. Cubrís actualidad nacional, política, gobierno, 
instituciones y desarrollo del Paraguay. 

Escribís notas periodísticas con:
- Lenguaje formal pero accesible
- Perspectiva institucional y ciudadana
- Sin tendencia partidaria explícita
- Enfoque en gobernabilidad, democracia, desarrollo nacional e identidad paraguaya
- Estilo de medio audiovisual serio

Respondé ÚNICAMENTE con un JSON válido con esta estructura exacta, sin markdown, sin explicaciones:
{
  "titulo": "título de la nota (máximo 100 caracteres)",
  "bajada": "bajada/copete de 1-2 oraciones (máximo 200 caracteres)",
  "cuerpo": "cuerpo completo de la nota en 4-6 párrafos separados por \\n\\n"
}`;

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'API de IA no configurada. Agregá GEMINI_API_KEY en Vercel.' }, { status: 503 });
  }

  const { tema, datos } = await req.json();
  if (!tema?.trim()) {
    return NextResponse.json({ error: 'Falta el tema' }, { status: 400 });
  }

  const prompt = `Generá una nota periodística sobre: "${tema}"${datos ? `\n\nDatos adicionales: ${datos}` : ''}`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: 'Entendido. Generaré notas periodísticas en el estilo de Ñande Stream.' }] },
          { role: 'user', parts: [{ text: prompt }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini error:', err);
      return NextResponse.json({ error: 'Error en el servicio de IA' }, { status: 500 });
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Limpiar posibles markdown fences
    const clean = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      // Si no viene como JSON, intentar extraer el contenido
      return NextResponse.json({ error: 'La IA no devolvió el formato esperado. Intentá de nuevo.' }, { status: 500 });
    }

    if (!parsed.titulo || !parsed.cuerpo) {
      return NextResponse.json({ error: 'Respuesta incompleta. Intentá de nuevo.' }, { status: 500 });
    }

    return NextResponse.json({
      titulo: parsed.titulo,
      bajada: parsed.bajada ?? '',
      cuerpo: parsed.cuerpo,
    });

  } catch (e) {
    console.error('Autonota error:', e);
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 });
  }
}
