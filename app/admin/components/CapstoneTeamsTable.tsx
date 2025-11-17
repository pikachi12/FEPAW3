"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, ExternalLink } from "react-feather";

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

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Capstone Teams Overview
        </h2>
        <ExternalLink className="h-5 w-5 cursor-pointer text-gray-500" />
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div
          className="relative"
          style={{ minWidth: "320px", flex: "1 1 320px" }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search team..."
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
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : sortedTeams.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data tim
                  </td>
                </tr>
              ) : (
                sortedTeams.slice(0, 3).map((team, idx) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {team.tema}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {team.namaTim}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {team.ketua?.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {team.ketua?.role}
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
