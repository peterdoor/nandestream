import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TickerWrapper from '@/components/layout/TickerWrapper';

export const metadata: Metadata = {
  title: {
    default: 'Ñande Stream – Información Nacional',
    template: '%s | Ñande Stream',
  },
  description: 'Canal paraguayo de streaming político e institucional. Análisis, actualidad y conversación pública sobre el Paraguay.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nandestream.com'),
  openGraph: {
    siteName: 'Ñande Stream',
    type: 'website',
    locale: 'es_PY',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <TickerWrapper />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
