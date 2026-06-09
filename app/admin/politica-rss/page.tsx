import AdminLayout from '@/components/admin/AdminLayout';
import RssPage from '@/components/admin/RssPage';

export default function PoliticaRssPage() {
  return (
    <AdminLayout>
      <RssPage
        titulo="Politica"
        descripcion="Importa noticias politicas e institucionales. La IA las reformula en tono formal."
        categoria="politica"
        colorBtn="bg-azul hover:bg-azul-claro"
        defaultFeeds={[
          'https://rss.app/feeds/pFSo2N4dTh6Lsgj6.xml',
          'https://rss.app/feeds/jlBW5vmr6gGL4Vkp.xml',
          'https://rss.app/feeds/8aL8ylqoRIT4F1uY.xml',
        ]}
      />
    </AdminLayout>
  );
}
