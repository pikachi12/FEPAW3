"use client";

import { useEffect, useState, useRef } from "react";
import { Search, ChevronDown, Filter } from "react-feather";
import PersonCardModal from "@/app/admin/components/modals/PersonCardModal";

export interface DosenData {
  id: string;
  nim: string;
  nip?: string;
  name: string;
  prodi: string;
  role: string;
  email: string;
  isVerified: boolean;
  isClaimed: boolean;
}

export default function AllDosenPage() {
  const [data, setData] = useState<DosenData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProdi, setSelectedProdi] = useState("All");
  const [selectedVerification, setSelectedVerification] = useState("All");
  const [selectedClaim, setSelectedClaim] = useState("All");
  const [search, setSearch] = useState("");

  const [selectedPerson, setSelectedPerson] = useState<DosenData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleRowClick = (person: DosenData) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPerson(null);
    setIsModalOpen(false);
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // FETCH DOSEN
  const fetchDosen = async () => {
    try {
      const params = new URLSearchParams();

      if (selectedProdi !== "All") params.append("prodi", selectedProdi);
      if (selectedVerification !== "All")
        params.append("isVerified", selectedVerification);
      if (selectedClaim !== "All")
        params.append("isClaimed", selectedClaim);

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/users?role=dosen&${params.toString()}`;

      const res = await fetch(endpoint, { credentials: "include" });
      const json = await res.json();
      const users = json.data || json;

      setData(users);

      // Ambil kategori Prodi
      const uniqueProdi = Array.from(
        new Set(
          users.map((u: any) => String(u.prodi || "Unknown"))
        )
      ) as string[];

      setCategories(uniqueProdi);
    } catch (err) {
      console.error("Failed to fetch dosen:", err);
    }
  };

  useEffect(() => {
    fetchDosen();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchDosen(), 250);
    return () => clearTimeout(timeout);
  }, [selectedProdi, selectedVerification, selectedClaim]);

  // Helper untuk cek filter aktif
  const isFilterActive = selectedVerification !== "All" || selectedClaim !== "All";

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        Data Person &gt; <span className="font-medium text-gray-700">All Dosen</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900">All Dosen</h1>
      <p className="mb-6 text-sm text-gray-600">List of all lecturers in the system</p>

      {/* Table Container */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">

        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-gray-200 p-4">

          {/* Filter dropdown tanpa Prodi */}
          <div className="relative">
            <button
              onClick={() => setOpenFilter((o) => !o)}
              className={`flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 relative`}
            >
              Filters <ChevronDown className="h-4 w-4" />
              {isFilterActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white"></span>
              )}
            </button>

            {openFilter && (
              <div
                ref={ref}
                className="absolute left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-20"
              >
                {/* VERIFIED */}
                <p className="text-xs font-medium mb-1 text-gray-600">
                  Verification Status
                </p>
                <select
                  value={selectedVerification}
                  onChange={(e) => setSelectedVerification(e.target.value)}
                  className="w-full border px-2 py-1 mb-3 rounded-md text-sm"
                >
                  <option value="All">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>

                {/* CLAIM STATUS */}
                <p className="text-xs font-medium mb-1 text-gray-600">
                  Claim Status
                </p>
                <select
                  value={selectedClaim}
                  onChange={(e) => setSelectedClaim(e.target.value)}
                  className="w-full border px-2 py-1 rounded-md text-sm"
                >
                  <option value="All">All</option>
                  <option value="true">Claimed</option>
                  <option value="false">Unclaimed</option>
                </select>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative ml-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search name/email..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  NIP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Program Studi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {data.filter((p) =>
                search.trim() === ""
                  ? true
                  : p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.email.toLowerCase().includes(search.toLowerCase())
              ).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Tidak ada data dosen ditemukan
                  </td>
                </tr>
              ) : (
                data
                  .filter((p) =>
                    search.trim() === ""
                      ? true
                      : p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.email.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((person, index) => (
                    <tr
                      key={person.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(person)}
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{person.nip || "-"}</td>
                      <td className="px-6 py-4">
                        {person.name}
                      </td>
                      <td className="px-6 py-4">
                        {person.prodi || "-"}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        {person.role}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
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
