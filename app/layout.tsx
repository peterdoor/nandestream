import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TickerWrapper from '@/components/layout/TickerWrapper';
import PuenteBar from '@/components/layout/PuenteBar';
import { getConfig } from '@/lib/supabase';

export const metadata: Metadata = {
  title: {
    default: 'Nande Stream - Informacion Nacional',
    template: '%s | Nande Stream',
  },
  description: 'Canal paraguayo de streaming politico e institucional.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nandestream.com'),
  openGraph: { siteName: 'Nande Stream', type: 'website', locale: 'es_PY' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfig();

  return (
    <html lang="es">
      <body>
        <Navbar
          youtubeUrl={config.youtube_url}
          whatsappUrl={config.whatsapp_url}
        />
        <TickerWrapper />
        <PuenteBar />
        <main>{children}</main>
        <Footer config={config} />
      </body>
    </html>
  );
}
