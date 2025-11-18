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

  // Tambahkan state untuk filter kategori dan status
  const [kategori, setKategori] = useState("All");
  const [status, setStatus] = useState("All");

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

  // List kategori dan status
  const kategoriList = ["All", "Pengolahan Sampah", "Kesehatan", "Pendidikan", "Transportasi Ramah Lingkungan"];
  const statusList = ["All", "Tersedia", "Tidak Tersedia"];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.judul.toLowerCase().includes(search.toLowerCase());
    const matchesKategori = kategori === "All" || p.kategori === kategori;
    const matchesStatus = status === "All" || p.status === status;

    return matchesSearch && matchesKategori && matchesStatus;
  });

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
          {/* Dropdown Kategori */}
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            {kategoriList.map((k, i) => (
              <option key={i} value={k}>
                {k}
              </option>
            ))}
          </select>

          {/* Dropdown Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            {statusList.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Searchbar di kanan */}
          <div className="relative ml-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tittle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md px-3 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-none"
            />
          </div>
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
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-400 text-sm">
                    Tidak ada data project ditemukan.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => (
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
                ))
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
