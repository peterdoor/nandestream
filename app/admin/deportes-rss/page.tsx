import AdminLayout from '@/components/admin/AdminLayout';
import RssPage from '@/components/admin/RssPage';

export default function DeportesRssPage() {
  return (
    <AdminLayout>
      <RssPage
        titulo="Deportes"
        descripcion="Importa noticias deportivas desde feeds RSS. La IA las reformula en estilo Nande Stream."
        categoria="deportes"
        colorBtn="bg-[#1A5C3A] hover:bg-[#145030]"
      />
    </AdminLayout>
  );
}
