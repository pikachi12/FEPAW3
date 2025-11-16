"use client"; // Ini penting untuk mengelola state modal

import { useState } from 'react';
import { Search, ChevronDown } from 'react-feather';
import ProjectCardModal from '@/app/admin/components/modals/ProjectCardModal'; // Kita akan buat ini
import { dummyProjectData, type ProjectData } from '@/lib/dummy-data';

export default function AllProjectsPage() {
  // 3. State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  
    // 4. Fungsi untuk membuka modal
    const handleRowClick = (project: ProjectData) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    // 5. Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        Capstone Projects &gt; <span className="font-medium text-gray-700">All Projects</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
      <p className="mb-6 text-sm text-gray-600">XXXXXXX</p>

      {/* Toolbar & Tabel */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 p-4">
          <button className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            Categorization
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            Filters
            <ChevronDown className="h-4 w-4" />
          </button>
          <div className="relative ml-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tema</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama Tim</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Judul</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {dummyProjectData.map((project, index) => (
                <tr 
                  key={project.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(project)} // <-- Aksi klik di sini
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{project.tema}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{project.namaTim}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{project.judul}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {/* Logika untuk warna status */}
                    <span 
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        project.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. RENDER MODAL DI SINI */}
      {selectedProject && (
        <ProjectCardModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          project={selectedProject}
        />
      )}
    </div>
  );
}
  