"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown } from "react-feather";
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

export default function AllTeamsPage() {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [filtered, setFiltered] = useState<GroupData[]>([]);
  const [search, setSearch] = useState("");

  // --- Filter states ---
  const [tema, setTema] = useState("All");
  const [tahun, setTahun] = useState("All");
  const [dosenId, setDosenId] = useState("All");

  // --- Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<GroupData | null>(null);

  // Tambahkan state untuk semua data tim
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

  // Fetch semua data tim untuk dropdown
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

  // Fetch awal & ketika filter berubah
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

  // Ambil list dropdown dari allGroups, bukan groups
  const temaList = ["All", ...new Set(allGroups.map((g) => g.tema))];
  const tahunList = ["All", ...new Set(allGroups.map((g) => g.tahun.toString()))];
  const dosenList = [
    "All",
    ...new Set(allGroups.map((g) => g.dosen?.id + "|" + g.dosen?.name)),
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        Capstone Teams &gt;{" "}
        <span className="font-medium text-gray-700">All Teams</span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900">All Teams</h1>
      <p className="mb-6 text-sm text-gray-600">List of all capstone teams in the system</p>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 p-4">
          {/* FILTER TEMA */}
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            {temaList.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* FILTER TAHUN */}
          <select
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            {tahunList.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* FILTER DOSEN */}
          <select
            value={dosenId}
            onChange={(e) => setDosenId(e.target.value)}
            className="border rounded-md px-3 py-2"
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

          {/* SEARCH */}
          <div className="relative ml-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search name/theme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md px-3 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-none"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tema</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Tim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ketua</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosen</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Tidak ada data tim ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((team, i) => (
                  <tr
                    key={team.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(team)}
                  >
                    <td className="px-6 py-4">{i + 1}</td>
                    <td className="px-6 py-4">{team.tema}</td>
                    <td className="px-6 py-4 font-medium">{team.namaTim}</td>
                    <td className="px-6 py-4">{team.ketua?.name}</td>
                    <td className="px-6 py-4">{team.dosen?.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
