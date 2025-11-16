"use client"; // Ini penting untuk mengelola state modal

import { useState } from 'react';
import { Search, ChevronDown } from 'react-feather';
import PersonCardModal from '@/app/admin/components/modals/PersonCardModal'; // Kita akan buat ini

// 1. Definisikan Tipe Data (sesuai tabel)
// Sebaiknya tipe ini disimpan di file terpisah (misal 'types.ts') agar bisa di-reuse
export interface PersonData {
  id: number;
  nimNip: string;
  nama: string;
  programStudi: string;
  role: 'Mahasiswa' | 'Alumni' | 'Dosen';
  email: string; // Diperlukan untuk modal
}

// 2. Data Dummy (ganti dengan data dari API)
const dummyData: PersonData[] = [
  { id: 1, nimNip: '22/504042/TK/55111', nama: 'Hanifah Putri Ariani', programStudi: 'Teknologi Informasi', role: 'Mahasiswa', email: 'hanifahputriariani@mail.ugm.ac.id' },
  { id: 2, nimNip: '22/504042/TK/55111', nama: 'Hanifah Putri Ariani', programStudi: 'Teknologi Informasi', role: 'Alumni', email: 'hanifahputriariani@mail.ugm.ac.id' },
  { id: 3, nimNip: '22/504042/TK/55111', nama: 'Hanifah Putri Ariani', programStudi: 'Teknologi Informasi', role: 'Mahasiswa', email: 'hanifahputriariani@mail.ugm.ac.id' },
  // ... data lainnya
];

export default function AllMahasiswaPage() {
  // 3. State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  // 4. Fungsi untuk membuka modal
  const handleRowClick = (person: PersonData) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  // 5. Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        Data Person &gt; <span className="font-medium text-gray-700">All Mahasiswa/Alumni</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900">All Mahasiswa/Alumni</h1>
      <p className="mb-6 text-sm text-gray-600">XXXXXXX</p>

      {/* Toolbar & Tabel (Mirip dengan CapstoneTeamsTable) */}
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">NIM/NIP</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Program Studi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {dummyData.map((person, index) => (
                <tr 
                  key={person.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(person)} // <-- Aksi klik di sini
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{person.nimNip}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{person.nama}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{person.programStudi}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{person.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. RENDER MODAL DI SINI 
        Modal ini hanya akan terlihat jika 'isModalOpen' adalah true
      */}
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