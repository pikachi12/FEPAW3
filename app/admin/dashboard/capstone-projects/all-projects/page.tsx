"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown } from "react-feather";
import ProjectCardModal from "@/app/admin/components/modals/ProjectCardModal";

export interface ProjectData {
  id: string;
  judul: string;
  kategori: string;
  status: string;
  tema?: string;
  namaTim?: string;
  ketua?: any;
  abstrak?: string;
  anggota: { id: string; name: string; email: string }[];
  dosen?: any;
  proposalUrl?: string;
  hasil?: string[];
}

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [search, setSearch] = useState("");

  // Fetch data dari backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/capstones`, {
          credentials: "include",
        });

        const data = await res.json();
        console.log("Fetched projects:", data);

        setProjects(data.capstones || data || []);
      } catch (err) {
        console.error("Gagal fetch projects:", err);
      }
    };

    fetchProjects();
  }, []);

  const handleRowClick = (project: ProjectData) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const filteredProjects = projects.filter((p) =>
    p.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4 text-sm text-gray-500">
        Capstone Projects &gt; <span className="font-medium text-gray-700">All Projects</span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
      <p className="mb-6 text-sm text-gray-600">List of all capstone projects in the system</p>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 p-4">
          <input
            type="text"
            placeholder="Search..."
            className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-4 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 md:w-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredProjects.map((project, index) => (
                <tr
                  key={project.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(project)}
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{project.kategori}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.judul}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        project.status === "Tersedia"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-400 text-sm">
                    Tidak ada project ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectCardModal isOpen={isModalOpen} onClose={handleCloseModal} project={selectedProject} />
      )}
    </div>
  );
}
