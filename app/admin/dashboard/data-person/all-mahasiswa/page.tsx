"use client";

import { useEffect, useState, useRef } from "react";
import { Search, ChevronDown } from "react-feather";
import PersonCardModal from "@/app/admin/components/modals/PersonCardModal";

export interface PersonData {
  id: string;
  nim: string;
  name: string;
  prodi: string;
  role: string;
  email: string;
  isVerified: boolean;
  isClaimed: boolean;
}

export default function AllMahasiswaPage() {
  const [users, setUsers] = useState<PersonData[]>([]);
  const [filtered, setFiltered] = useState<PersonData[]>([]);
  const [search, setSearch] = useState("");

  // Filter states
  const [categoryRole, setCategoryRole] = useState("mahasiswa,alumni");
  const [filterProdi, setFilterProdi] = useState("All");
  const [filterVerified, setFilterVerified] = useState("All");
  const [filterClaimed, setFilterClaimed] = useState("All");

  // Dropdown UI
  const [openCategory, setOpenCategory] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  const handleRowClick = (p: PersonData) => {
    setSelectedPerson(p);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPerson(null);
    setIsModalOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setOpenCategory(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenFilter(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // FETCH USERS (API)
  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      params.append("role", categoryRole);
      if (filterProdi !== "All") params.append("prodi", filterProdi);
      if (filterVerified !== "All") params.append("isVerified", filterVerified);
      if (filterClaimed !== "All") params.append("isClaimed", filterClaimed);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users?${params.toString()}`,
        { credentials: "include" }
      );
      const json = await res.json();
      const data: PersonData[] = json.data || json;

      setUsers(data);
      setFiltered(data);
    } catch (err) {
      console.error("FetchUsers Error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [categoryRole, filterProdi, filterVerified, filterClaimed]);

  // Search
  useEffect(() => {
    const t = setTimeout(() => {
      const temp = users.filter((u) =>
        (u.name + u.nim + u.email)
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      setFiltered(temp);
    }, 250);
    return () => clearTimeout(t);
  }, [search, users]);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        Data Person &gt;{" "}
        <span className="font-medium text-gray-700">All Mahasiswa/Alumni</span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900">All Mahasiswa/Alumni</h1>
      <p className="mb-6 text-sm text-gray-600">
        List of all Mahasiswa and Alumni in the system
      </p>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-gray-200 p-4">

          {/* CATEGORY DROPDOWN */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => setOpenCategory((p) => !p)}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Categorization <ChevronDown className="h-4 w-4" />
            </button>

            {openCategory && (
              <div className="absolute mt-2 w-48 rounded-lg border bg-white p-3 shadow-lg z-20">
                <div
                  className="cursor-pointer rounded px-2 py-1 hover:bg-gray-100"
                  onClick={() => { setCategoryRole("mahasiswa,alumni"); setOpenCategory(false); }}
                >
                  Mahasiswa + Alumni
                </div>
                <div
                  className="cursor-pointer rounded px-2 py-1 hover:bg-gray-100"
                  onClick={() => { setCategoryRole("mahasiswa"); setOpenCategory(false); }}
                >
                  Mahasiswa
                </div>
                <div
                  className="cursor-pointer rounded px-2 py-1 hover:bg-gray-100"
                  onClick={() => { setCategoryRole("alumni"); setOpenCategory(false); }}
                >
                  Alumni
                </div>
              </div>
            )}
          </div>

          {/* FILTERS DROPDOWN */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setOpenFilter((p) => !p)}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Filters <ChevronDown className="h-4 w-4" />
            </button>

            {openFilter && (
              <div className="absolute mt-2 w-64 rounded-lg border bg-white p-4 shadow-lg z-20">
                {/* PRODI */}
                <p className="text-xs font-semibold text-gray-600 mb-1">Program Studi</p>
                <select
                  className="w-full mb-3 border rounded px-2 py-1 text-sm"
                  value={filterProdi}
                  onChange={(e) => setFilterProdi(e.target.value)}
                >
                  <option value="All">All Prodi</option>
                  <option value="Teknologi Informasi">Teknologi Informasi</option>
                  <option value="Teknik Elektro">Teknik Elektro</option>
                  <option value="Teknik Biomedis">Teknik Biomedis</option>
                </select>

                {/* VERIFIED */}
                <p className="text-xs font-semibold text-gray-600 mb-1">Verification</p>
                <select
                  className="w-full mb-3 border rounded px-2 py-1 text-sm"
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>

                {/* CLAIMED */}
                <p className="text-xs font-semibold text-gray-600 mb-1">Claim Status</p>
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={filterClaimed}
                  onChange={(e) => setFilterClaimed(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="true">Claimed</option>
                  <option value="false">Unclaimed</option>
                </select>
              </div>
            )}
          </div>

          {/* SEARCH */}
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm shadow-sm"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prodi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(p)}
                >
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4">{p.nim}</td>
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">{p.prodi}</td>
                  <td className="px-6 py-4 capitalize">{p.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedPerson && (
        <PersonCardModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          person={selectedPerson}
        />
      )}
    </div>
  );
}
