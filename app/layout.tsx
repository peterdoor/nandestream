import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Ticker from '@/components/layout/Ticker';

export const metadata: Metadata = {
  title: {
    default: 'Ñande Stream – Información Nacional',
    template: '%s | Ñande Stream',
  },
  description:
    'Espacio digital de información, análisis y conversación pública sobre la actualidad nacional, la gestión institucional, la comunidad y el desarrollo del Paraguay.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nande.stream'),
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
        <Ticker />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
