import { NextRequest, NextResponse } from 'next/server';

function auth(req: NextRequest) {
  const s = req.cookies.get('admin_session');
  return s && s.value === process.env.ADMIN_PASSWORD;
}

function extractValue(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : '';
}

function extractImage(item: string): string {
  const tests = [
    /media:content[^>]+url="([^"]+)"/i,
    /media:thumbnail[^>]+url="([^"]+)"/i,
    /enclosure[^>]+url="([^"]+)"/i,
    /<img[^>]+src="([^"]+)"/i,
  ];
  for (const r of tests) {
    const m = item.match(r);
    if (m) return m[1];
  }
  return '';
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { urls, limit = 100 } = await req.json();
  if (!urls?.length) return NextResponse.json({ items: [] });

  const allItems: object[] = [];
  const seen = new Set<string>();

  await Promise.all(
    urls.map(async (url: string) => {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'NandeStream/1.0' },
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) return;
        const xml = await res.text();
        const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];

        itemMatches.forEach(item => {
          const titulo = extractValue(item, 'title');
          const bajada = extractValue(item, 'description').replace(/<[^>]+>/g, '').slice(0, 400);
          const url_original = extractValue(item, 'link') || extractValue(item, 'guid');
          const imagen_url = extractImage(item);
          const fecha = extractValue(item, 'pubDate');

          if (titulo && url_original && !seen.has(url_original)) {
            seen.add(url_original);
            allItems.push({ titulo, bajada, url_original, imagen_url, fecha, fuente: url });
          }
        });
      } catch (e) {
        console.error('RSS fetch error:', url, e);
      }
    })
  );

  // Ordenar por fecha descendente y limitar
  const sorted = allItems
    .sort((a: any, b: any) => new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime())
    .slice(0, limit);

  return NextResponse.json({ items: sorted });
}
