"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, ExternalLink } from "react-feather";
import ProjectCardModal from "@/app/admin/components/modals/ProjectCardModal";

interface ProjectData {
  id: string;
  judul: string;
  kategori: string;
  status: string;
  namaTim?: string;
  ketuaId: string;
  ketua?: { email: string };
  // anggota is required by the ProjectData type used elsewhere (e.g. all-projects page)
  anggota: { id: string; name: string; email: string }[];
  pendingGroupsCount: number;
}

export default function CapstoneProjectTable() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [filtered, setFiltered] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  // Sorting
  type SortField = keyof ProjectData;
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronDown size={14} className="inline text-gray-300" />;

    return sortOrder === "asc"
      ? <ChevronUp size={14} className="inline text-gray-600" />
      : <ChevronDown size={14} className="inline text-gray-600" />;
  };

  // Sorting helper
  const sortValue = (p: ProjectData, field: SortField) =>
    (p[field] ?? "").toString().toLowerCase();

  // Fetch
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/capstones`,
        { credentials: "include" }
      );
      const data = await res.json();
      const list = data.capstones || data || [];
      setProjects(list);
      setFiltered(list);
    } catch (err) {
      setError("Gagal mengambil data project");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Search
  useEffect(() => {
    const t = setTimeout(() => {
      const q = search.toLowerCase();
      const result = projects.filter((p) =>
        (p.judul + p.kategori + p.status)
          .toLowerCase()
          .includes(q)
      );
      setFiltered(result);
    }, 250);

    return () => clearTimeout(t);
  }, [search, projects]);

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;

    const x = sortValue(a, sortField);
    const y = sortValue(b, sortField);

    if (x < y) return sortOrder === "asc" ? -1 : 1;
    if (x > y) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field)
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleProjectClick = (project: ProjectData) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section className="mt-8 px-4 sm:px-0">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Capstone Projects Overview
          </h2>
          <a href="/admin/dashboard/capstone-projects/all-projects" title="Lihat semua project">
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search project..."
            className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort("id")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                No <SortIcon field="id" />
              </th>
              <th
                onClick={() => handleSort("kategori")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Kategori <SortIcon field="kategori" />
              </th>
              <th
                onClick={() => handleSort("judul")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Judul <SortIcon field="judul" />
              </th>
              <th
                onClick={() => handleSort("status")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Status <SortIcon field="status" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-red-500">
                  {error}
                  <br />
                  <button
                    onClick={fetchProjects}
                    className="mt-2 px-4 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs"
                  >
                    Refresh
                  </button>
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada project ditemukan.
                </td>
              </tr>
            ) : (
              sorted.slice(0, 3).map((project, i) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleProjectClick(project)}
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{i + 1}</td>
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

      {/* Mobile Card View - Visible on Mobile Only */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-gray-500">
            Memuat data...
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg border border-red-200 p-4 text-center text-red-500">
            {error}
            <br />
            <button
              onClick={fetchProjects}
              className="mt-2 px-4 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs"
            >
              Refresh
            </button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-gray-500">
            Tidak ada project ditemukan.
          </div>
        ) : (
          sorted.slice(0, 3).map((project, i) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
              onClick={() => handleProjectClick(project)}
            >
              {/* Header with Number and Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 text-sm font-semibold">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
                    {project.judul}
                  </h3>
                </div>
                <span
                  className={`flex-shrink-0 ml-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                    project.status === "Tersedia"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              
              {/* Project Details */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Kategori
                  </p>
                  <p className="text-sm text-gray-700">{project.kategori}</p>
                </div>
                
                {project.namaTim && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Nama Tim
                    </p>
                    <p className="text-sm text-gray-700">{project.namaTim}</p>
                  </div>
                )}
                
                {project.ketua?.email && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Email Ketua
                    </p>
                    <p className="text-sm text-gray-700 break-all">{project.ketua.email}</p>
                  </div>
                )}
              </div>

              {/* Tap Indicator */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Tap untuk detail
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ProjectCardModal - Use your actual modal component */}
      {isModalOpen && selectedProject && (
        <ProjectCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={selectedProject}
        />
      )}
    </section>
  );
}