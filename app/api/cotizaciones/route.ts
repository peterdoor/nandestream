import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ExchangeRate-API gratuito sin key (límite generoso)
    const res = await fetch(
      'https://open.er-api.com/v6/latest/USD',
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const rates = data.rates;

    // Guaraní por unidad de cada moneda
    const pyg = rates.PYG ?? 7850;

    return NextResponse.json({
      usd_pyg: Math.round(pyg),
      eur_pyg: Math.round(pyg / rates.EUR),
      brl_pyg: Math.round(pyg / rates.BRL),
      ars_pyg: Math.round(pyg / rates.ARS),
    });
  } catch (e) {
    console.error('Cotizaciones error:', e);
    return NextResponse.json({
      usd_pyg: 0, eur_pyg: 0, brl_pyg: 0, ars_pyg: 0,
    });
  }
}
