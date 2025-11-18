"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, ExternalLink } from "react-feather";
import TeamCardModal from "@/app/admin/components/modals/TeamCardModal";

interface TeamData {
  id: string;
  tema: string;
  namaTim: string;
  ketua: {
    email: string;
    role: string;
  };
}

export default function CapstoneTeamsTable() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [filtered, setFiltered] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);

  // Sorting
  type SortField = keyof TeamData | "ketuaEmail" | "ketuaRole";
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortValue = (team: TeamData, field: SortField): string => {
    if (field === "ketuaEmail") return team.ketua?.email || "";
    if (field === "ketuaRole") return team.ketua?.role || "";
    return (team[field] ?? "").toString();
  };

  // Sorting icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronDown size={14} className="inline text-gray-300" />;

    return sortOrder === "asc" ? (
      <ChevronUp size={14} className="inline text-gray-600" />
    ) : (
      <ChevronDown size={14} className="inline text-gray-600" />
    );
  };

  // Fetch teams
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchTeams = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/groups/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!isMounted) return;
        const data = await res.json();

        setTeams(data.groups || []);
        setFiltered(data.groups || []);
      } catch (e) {
        setError("Terjadi kesalahan saat fetch tim");
      }

      setLoading(false);
    };

    fetchTeams();
    return () => {
      isMounted = false;
    };
  }, []);

  // Search
  useEffect(() => {
    const t = setTimeout(() => {
      const result = teams.filter((team) =>
        (team.namaTim + team.tema + team.ketua?.email)
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      setFiltered(result);
    }, 300);

    return () => clearTimeout(t);
  }, [search, teams]);

  // Apply sorting
  const sortedTeams = [...filtered].sort((a, b) => {
    if (!sortField) return 0;

    const x = sortValue(a, sortField).toLowerCase();
    const y = sortValue(b, sortField).toLowerCase();

    if (x < y) return sortOrder === "asc" ? -1 : 1;
    if (x > y) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Handle team click
  const handleTeamClick = (team: TeamData) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  return (
    <section className="mt-8 px-4 sm:px-0">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Capstone Teams Overview
          </h2>
          <a href="/admin/dashboard/capstone-teams/all-teams" title="Lihat semua tim">
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search team..."
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
                onClick={() => handleSort("tema")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Tema <SortIcon field="tema" />
              </th>
              <th
                onClick={() => handleSort("namaTim")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Nama Tim <SortIcon field="namaTim" />
              </th>
              <th
                onClick={() => handleSort("ketuaEmail")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Email Ketua <SortIcon field="ketuaEmail" />
              </th>
              <th
                onClick={() => handleSort("ketuaRole")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Role <SortIcon field="ketuaRole" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : sortedTeams.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data tim
                </td>
              </tr>
            ) : (
              sortedTeams.slice(0, 3).map((team, idx) => (
                <tr 
                  key={team.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleTeamClick(team)}
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{team.tema}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{team.namaTim}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{team.ketua?.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{team.ketua?.role}</td>
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
          </div>
        ) : sortedTeams.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-gray-500">
            Tidak ada data tim
          </div>
        ) : (
          sortedTeams.slice(0, 3).map((team, idx) => (
            <div
              key={team.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
              onClick={() => handleTeamClick(team)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {team.namaTim}
                  </h3>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tema</p>
                  <p className="text-sm text-gray-700">{team.tema}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email Ketua</p>
                  <p className="text-sm text-gray-700 break-all">{team.ketua?.email}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Role</p>
                  <p className="text-sm text-gray-700">{team.ketua?.role}</p>
                </div>
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

      {/* TeamCardModal */}
      {isModalOpen && selectedTeam && (
        <TeamCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          team={{
            ...(selectedTeam as any),
            tahun: (selectedTeam as any)?.tahun ?? new Date().getFullYear(),
            anggota: (selectedTeam as any)?.anggota ?? [],
            dosen: (selectedTeam as any)?.dosen ?? [],
          }}
        />
      )}
    </section>
  );
}