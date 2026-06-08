import AdminLayout from '@/components/admin/AdminLayout';
import RssPage from '@/components/admin/RssPage';

export default function PoliticaRssPage() {
  return (
    <AdminLayout>
      <RssPage
        titulo="Politica"
        descripcion="Importa noticias politicas e institucionales desde feeds RSS. La IA las reformula en tono formal e informativo."
        categoria="politica"
        colorBtn="bg-azul hover:bg-azul-claro"
      />
    </AdminLayout>
  );
}
