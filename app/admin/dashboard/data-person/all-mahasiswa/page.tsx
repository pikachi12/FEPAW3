"use client";

import { useEffect, useState, useRef } from "react";
import { Search, ChevronDown, Filter } from "react-feather";
import AdminPagination from "@/app/admin/components/AdminPagination";
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

export default function Page() {
  const [users, setUsers] = useState<PersonData[]>([]);
  const [filtered, setFiltered] = useState<PersonData[]>([]);
  const [search, setSearch] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

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

      // FORCE TO ARRAY SAFELY
      const raw = json.data ?? json;

      // kalau bukan array → jadikan array kosong
      const arr: PersonData[] = Array.isArray(raw) ? raw : [];

      setUsers(arr);
      setFiltered(arr);
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

  // Helper untuk label kategori
  const getCategoryLabel = () => {
    if (categoryRole === "mahasiswa,alumni") return "Mahasiswa + Alumni";
    if (categoryRole === "mahasiswa") return "Mahasiswa";
    if (categoryRole === "alumni") return "Alumni";
    return "Categorization";
  };

  // Helper untuk cek filter aktif
  const isFilterActive = filterProdi !== "All" || filterVerified !== "All" || filterClaimed !== "All";

  // Pagination logic
  const paginatedFiltered = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="py-4 md:px-6 lg:px-8 max-w-full overflow-hidden">
      {/* Breadcrumb */}
      <div className="mb-3 md:mb-4 text-xs md:text-sm text-gray-500 truncate">
        Data Person &gt;{" "}
        <span className="font-medium text-gray-700">All Mahasiswa/Alumni</span>
      </div>

      <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">All Mahasiswa/Alumni</h1>
      <p className="mb-4 md:mb-6 text-xs md:text-sm text-gray-600">
        List of all Mahasiswa and Alumni in the system
      </p>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">

            {/* CATEGORY DROPDOWN */}
            <div className="relative w-full md:w-auto" ref={categoryRef}>
              <button
                onClick={() => setOpenCategory((p) => !p)}
                className="flex items-center justify-between w-full md:w-auto gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span className="truncate">{getCategoryLabel()}</span>
                <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${openCategory ? 'rotate-180' : ''}`} />
              </button>

              {openCategory && (
                <div className="absolute mt-2 left-0 right-0 md:left-auto md:right-auto md:w-48 rounded-lg border bg-white p-3 shadow-lg z-20">
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
            <div className="relative w-full md:w-auto" ref={filterRef}>
              <button
                onClick={() => setOpenFilter((p) => !p)}
                className="flex items-center justify-between w-full md:w-auto gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 relative"
              >
                <div className="flex items-center gap-1.5">
                  <Filter className="h-4 w-4 flex-shrink-0" />
                  <span>Filters</span>
                </div>
                <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${openFilter ? 'rotate-180' : ''}`} />
                {isFilterActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white"></span>
                )}
              </button>

              {openFilter && (
                <div className="absolute mt-2 left-0 right-0 md:left-auto md:right-auto md:w-64 rounded-lg border bg-white p-4 shadow-lg z-20">
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
            <div className="relative w-full md:flex-1 md:ml-auto">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
              </div>
              <input
                type="text"
                placeholder="Search name/email..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prodi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedFiltered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                paginatedFiltered.map((p, i) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(p)}
                  >
                    <td className="px-6 py-4">{(page - 1) * rowsPerPage + i + 1}</td>
                    <td className="px-6 py-4">{p.nim}</td>
                    <td className="px-6 py-4">{p.name}</td>
                    <td className="px-6 py-4">{p.prodi}</td>
                    <td className="px-6 py-4 capitalize">{p.role}</td>
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
              Tidak ada data ditemukan
            </div>
          ) : (
            paginatedFiltered.map((p, i) => (
              <div
                key={p.id}
                className="p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100"
                onClick={() => handleRowClick(p)}
              >
                <div className="flex items-start justify-between mb-2 min-w-0">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-medium text-gray-900 text-base mb-1 break-words">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-500 mb-2 break-words">
                      #{(page - 1) * rowsPerPage + i + 1} · {p.nim}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-sm min-w-0">
                  <div className="flex items-start text-gray-600 min-w-0">
                    <span className="text-xs font-medium text-gray-500 w-16 flex-shrink-0">
                      Prodi:
                    </span>
                    <span className="text-xs break-words flex-1">{p.prodi}</span>
                  </div>
                  <div className="flex items-start text-gray-600 min-w-0">
                    <span className="text-xs font-medium text-gray-500 w-16 flex-shrink-0">
                      Email:
                    </span>
                    <span className="text-xs break-all flex-1">{p.email}</span>
                  </div>
                  <div className="flex items-start text-gray-600">
                    <span className="text-xs font-medium text-gray-500 w-16 flex-shrink-0">
                      Role:
                    </span>
                    <span className="text-xs capitalize flex-1">{p.role}</span>
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