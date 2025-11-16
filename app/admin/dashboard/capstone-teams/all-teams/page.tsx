"use client"; // Ini penting untuk mengelola state modal

import { useState } from 'react';
import { Search, ChevronDown } from 'react-feather';
import TeamCardModal from '@/app/admin/components/modals/TeamCardModal'; // Kita akan buat ini
// 1. IMPORT DATA DAN TIPE DARI FILE BARU
import { dummyTeamData, type TeamData } from '@/lib/dummy-data';

export default function AllTeamsPage() {
  // 3. State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);

  // 4. Fungsi untuk membuka modal
  const handleRowClick = (team: TeamData) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  // 5. Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        Capstone Teams &gt; <span className="font-medium text-gray-700">All Teams</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900">All Teams</h1>
      <p className="mb-6 text-sm text-gray-600">XXXXXXX</p>

      {/* Toolbar & Tabel */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 p-4">
          <button className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            Categorization
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            Filters
            <ChevronDown className="h-4 w-4" />
          </button>
          <div className="relative ml-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tema</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama Tim</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email Ketua</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {dummyTeamData.map((team, index) => (
                <tr 
                  key={team.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(team)}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{team.tema}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{team.namaTim}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{team.emailKetua}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{team.roleKetua}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Modal */}
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