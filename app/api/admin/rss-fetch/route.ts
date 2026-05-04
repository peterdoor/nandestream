import { NextRequest, NextResponse } from 'next/server';

const session_check = (req: NextRequest) => {
  const s = req.cookies.get('admin_session');
  return s && s.value === process.env.ADMIN_PASSWORD;
};

function extractValue(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<\\!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : '';
}

function extractImage(item: string): string {
  const mediaMatch = item.match(/media:content[^>]+url="([^"]+)"/i);
  if (mediaMatch) return mediaMatch[1];
  const enclosureMatch = item.match(/enclosure[^>]+url="([^"]+)"/i);
  if (enclosureMatch) return enclosureMatch[1];
  const imgMatch = item.match(/<img[^>]+src="([^"]+)"/i);
  if (imgMatch) return imgMatch[1];
  return '';
}

export async function POST(req: NextRequest) {
  if (!session_check(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { urls } = await req.json();
  if (!urls?.length) {
    return NextResponse.json({ items: [] });
  }

  const allItems: object[] = [];

  await Promise.all(
    urls.map(async (url: string) => {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'NandeStream/1.0' },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return;
        const xml = await res.text();

        const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
        itemMatches.slice(0, 10).forEach(item => {
          const titulo = extractValue(item, 'title');
          const bajada = extractValue(item, 'description').replace(/<[^>]+>/g, '').slice(0, 300);
          const url_original = extractValue(item, 'link') || extractValue(item, 'guid');
          const imagen_url = extractImage(item);
          const fecha = extractValue(item, 'pubDate');

          if (titulo && url_original) {
            allItems.push({ titulo, bajada, url_original, imagen_url, fecha, fuente: url });
          }
        });
      } catch (e) {
        console.error('RSS fetch error:', url, e);
      }
    })
  );

  return NextResponse.json({ items: allItems });
}
