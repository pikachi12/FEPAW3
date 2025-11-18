"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown } from "react-feather";
import AdminPagination from "@/app/admin/components/AdminPagination";
import TeamCardModal from "@/app/admin/components/modals/TeamCardModal";

export interface GroupData {
  id: string;
  tema: string;
  namaTim: string;
  tahun: number;
  ketua: {
    id: string;
    name: string;
    email: string;
    nim: string;
    role: string;
  };
  anggota: any[];
  dosen: {
    id: string;
    name: string;
    email: string;
  };
  linkCVGabungan?: string;
  reportIssue?: any;
}

export default function Page() {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [filtered, setFiltered] = useState<GroupData[]>([]);
  const [search, setSearch] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // --- Filter states ---
  const [tema, setTema] = useState("All");
  const [tahun, setTahun] = useState("All");
  const [dosenId, setDosenId] = useState("All");

  // --- Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<GroupData | null>(null);

  // --- Mobile filter toggle ---
  const [showFilters, setShowFilters] = useState(false);

  const [allGroups, setAllGroups] = useState<GroupData[]>([]);

  const handleRowClick = (team: GroupData) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTeam(null);
    setIsModalOpen(false);
  };

  const fetchGroups = async () => {
    try {
      const params = new URLSearchParams();

      if (tema !== "All") params.append("tema", tema);
      if (tahun !== "All") params.append("tahun", tahun);
      if (dosenId !== "All") params.append("dosen", dosenId);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/groups?${params.toString()}`,
        { credentials: "include" }
      );

      const json = await res.json();
      const data = json.groups || [];

      setGroups(data);
      setFiltered(data);
    } catch (err) {
      console.error("Fetch Groups Error:", err);
    }
  };

  const fetchAllGroups = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/groups`,
        { credentials: "include" }
      );
      const json = await res.json();
      const data = json.groups || [];
      setAllGroups(data);
    } catch (err) {
      console.error("Fetch All Groups Error:", err);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchAllGroups();
  }, [tema, tahun, dosenId]);

  // SEARCH
  useEffect(() => {
    const t = setTimeout(() => {
      const temp = groups.filter((g) =>
        (g.namaTim + g.tema + g.ketua.name)
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      setFiltered(temp);
    }, 300);

    return () => clearTimeout(t);
  }, [search, groups]);

  const temaList = ["All", ...new Set(allGroups.map((g) => g.tema))];
  const tahunList = ["All", ...new Set(allGroups.map((g) => g.tahun.toString()))];
  const dosenList = [
    "All",
    ...new Set(allGroups.map((g) => g.dosen?.id + "|" + g.dosen?.name)),
  ];

  // Pagination logic
  const paginatedFiltered = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="py-4 md:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="mb-3 md:mb-4 text-xs md:text-sm text-gray-500">
        Capstone Teams &gt;{" "}
        <span className="font-medium text-gray-700">All Teams</span>
      </div>

      <h1 className="text-xl md:text-2xl font-semibold text-gray-900">All Teams</h1>
      <p className="mb-4 md:mb-6 text-xs md:text-sm text-gray-600">
        List of all capstone teams in the system
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

          {/* Mobile: Dropdown khusus filter */}
          {showFilters && (
            <div className="md:hidden bg-white border rounded-lg shadow-lg p-4 mb-3">
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm mb-2"
              >
                {temaList.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm mb-2"
              >
                {tahunList.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={dosenId}
                onChange={(e) => setDosenId(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm mb-2"
              >
                {dosenList.map((d, i) => {
                  const [id, name] = d.split("|");
                  return (
                    <option key={i} value={id}>
                      {name || "All"}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Mobile: Search bar selalu tampil di bawah tombol Filters */}
          <div className="md:hidden relative w-full mb-3">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search name/theme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md px-3 pl-9 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-none"
            />
          </div>

          {/* Desktop: Filters & Search sebaris */}
          <div className="hidden md:flex flex-row md:items-center gap-2 mb-3 md:mb-0">
            <select
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="w-full md:w-auto border rounded-md px-3 py-2 text-sm mb-0"
            >
              {temaList.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full md:w-auto border rounded-md px-3 py-2 text-sm mb-0"
            >
              {tahunList.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={dosenId}
              onChange={(e) => setDosenId(e.target.value)}
              className="w-full md:w-auto border rounded-md px-3 py-2 text-sm mb-0"
            >
              {dosenList.map((d, i) => {
                const [id, name] = d.split("|");
                return (
                  <option key={i} value={id}>
                    {name || "All"}
                  </option>
                );
              })}
            </select>
            <div className="relative w-full md:w-64 md:ml-auto">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search name/theme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md px-3 pl-9 md:pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-none"
              />
            </div>
          </div>
        </div>

        {/* TABLE - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tema
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nama Tim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ketua
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dosen
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedFiltered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-400 text-sm"
                  >
                    Tidak ada data tim ditemukan
                  </td>
                </tr>
              ) : (
                paginatedFiltered.map((team, i) => (
                  <tr
                    key={team.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(team)}
                  >
                    <td className="px-6 py-4">{(page - 1) * rowsPerPage + i + 1}</td>
                    <td className="px-6 py-4">{team.tema}</td>
                    <td className="px-6 py-4 font-medium">{team.namaTim}</td>
                    <td className="px-6 py-4">{team.ketua?.name}</td>
                    <td className="px-6 py-4">{team.dosen?.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination Desktop */}
          <div className="py-4 flex justify-end">
            <AdminPagination
              total={filtered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* CARD VIEW - Mobile */}
        <div className="md:hidden divide-y divide-gray-200">
          {paginatedFiltered.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              Tidak ada data tim ditemukan
            </div>
          ) : (
            paginatedFiltered.map((team, i) => (
              <div
                key={team.id}
                className="p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100"
                onClick={() => handleRowClick(team)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-base mb-1">
                      {team.namaTim}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      #{(page - 1) * rowsPerPage + i + 1} · {team.tema}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="text-xs font-medium text-gray-500 w-16">
                      Ketua:
                    </span>
                    <span className="text-xs">{team.ketua?.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-xs font-medium text-gray-500 w-16">
                      Dosen:
                    </span>
                    <span className="text-xs">{team.dosen?.name}</span>
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Pagination Mobile */}
          <div className="py-4 flex justify-center">
            <AdminPagination
              total={filtered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedTeam && (
        <TeamCardModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          team={selectedTeam}
        />
      )}
    </div>
  );
}