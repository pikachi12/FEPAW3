import TeamForm from '@/app/admin/components/TeamForm'; // Impor form reusable
import { dummyTeamData } from '@/lib/dummy-data';   // Impor data
import { notFound } from 'next/navigation';

// Halaman ini menerima 'params' dari URL
export default async function EditTeamPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // "Fetch" data tim berdasarkan ID dari URL
  // Di aplikasi nyata, ini adalah panggilan 'await fetch(...)' ke API
  const team = dummyTeamData.find(t => t.id.toString() === id);

  // Jika tim tidak ditemukan, tampilkan halaman 404
  if (!team) {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        Capstone Teams &gt; All Teams &gt; <span className="font-medium text-gray-700">Edit Team</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900">Edit Team</h1>
      <p className="mb-6 text-sm text-gray-600">XXXXXXX</p>

      {/* Render form reusable, tapi kali ini dengan 'initialData' */}
      <TeamForm initialData={team} />
    </div>
  );
}