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
  ketua?: { email: string };
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
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/capstones`,
          { credentials: "include" }
        );
        if (!mounted) return;

        const data = await res.json();
        const list = data.capstones || data || [];

        setProjects(list);
        setFiltered(list);
      } catch (err) {
        setError("Gagal mengambil data project");
      }

      setLoading(false);
    };

    fetchProjects();
    return () => { mounted = false; };
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

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Capstone Projects Overview
        </h2>
        <ExternalLink className="h-5 w-5 cursor-pointer text-gray-500" />
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative" style={{ minWidth: "320px", flex: "1 1 320px" }}>
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search project..."
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-400">
                    Tidak ada project ditemukan.
                  </td>
                </tr>
              ) : (
                sorted.slice(0, 3).map((project, i) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedProject(project);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{i + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{project.kategori}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {project.judul}
                    </td>
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
    </section>
  );
}
