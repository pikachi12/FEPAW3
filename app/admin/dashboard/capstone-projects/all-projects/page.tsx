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

  // Filter states
  const [kategori, setKategori] = useState("All");
  const [status, setStatus] = useState("All");

  // Mobile filter toggle
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="py-4 md:px-6 lg:px-8">
      <div className="mb-3 md:mb-4 text-xs md:text-sm text-gray-500">
        Capstone Projects &gt; <span className="font-medium text-gray-700">All Projects</span>
      </div>

      <h1 className="text-xl md:text-2xl font-semibold text-gray-900">All Projects</h1>
      <p className="mb-4 md:mb-6 text-xs md:text-sm text-gray-600">
        List of all capstone projects in the system
      </p>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-3 md:p-4">
          {/* Mobile: Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mb-3 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm md:hidden"
          >
            <span>Filters</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Filters - Desktop: always visible, Mobile: collapsible */}
          <div
            className={`${
              showFilters ? "flex" : "hidden"
            } md:flex flex-col md:flex-row gap-2 mb-3 md:mb-0`}
          >
            {/* Dropdown Kategori */}
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full md:w-auto border rounded-md px-3 py-2 text-sm"
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
              className="w-full md:w-auto border rounded-md px-3 py-2 text-sm"
            >
              {statusList.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Searchbar */}
          <div className="relative w-full md:w-auto md:ml-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md px-3 pl-9 md:pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-none"
            />
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
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

        {/* Card View - Mobile */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredProjects.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              Tidak ada data project ditemukan.
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100"
                onClick={() => handleRowClick(project)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-base mb-1 line-clamp-2">
                      {project.judul}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      #{index + 1} · {project.kategori}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      project.status === "Tersedia"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectCardModal isOpen={isModalOpen} onClose={handleCloseModal} project={selectedProject} />
      )}
    </div>
  );
}