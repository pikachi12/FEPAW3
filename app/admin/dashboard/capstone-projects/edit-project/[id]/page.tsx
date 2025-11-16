import ProjectForm from '@/app/admin/components/ProjectForm'; // Impor form reusable
import { dummyProjectData } from '@/lib/dummy-data';   // Impor data
import { notFound } from 'next/navigation';

// Halaman ini menerima 'params' dari URL
export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // "Fetch" data proyek berdasarkan ID dari URL
  // Di aplikasi nyata, ini adalah 'await fetch(...)' ke API
  const project = dummyProjectData.find(p => p.id.toString() === id);

  // Jika proyek tidak ditemukan, tampilkan halaman 404
  if (!project) {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        Capstone Projects &gt; All Projects &gt; <span className="font-medium text-gray-700">Edit Project</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900">Edit Project</h1>
      <p className="mb-6 text-sm text-gray-600">XXXXXXX</p>

      {/* Render form reusable, tapi kali ini dengan 'initialData' */}
      <ProjectForm initialData={project} />
    </div>
  );
}