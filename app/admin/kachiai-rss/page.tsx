import AdminLayout from '@/components/admin/AdminLayout';
import RssPage from '@/components/admin/RssPage';

export default function KachiaiRssPage() {
  return (
    <AdminLayout>
      <RssPage
        titulo="Kachiai"
        descripcion="Importa noticias de entretenimiento y cultura. La IA las reformula en tono Kachiai paraguayo."
        categoria="kachiai"
        colorBtn="bg-rojo hover:bg-rojo-oscuro"
        defaultFeeds={[
          'https://rss.app/feeds/R84xZmnvmSJwmsB6.xml',
        ]}
      />
    </AdminLayout>
  );
}
