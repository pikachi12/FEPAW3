import { ChevronDown } from 'react-feather';
import React from 'react';

// --- Sub-komponen untuk Input ---
// (Diletakkan di file yang sama atau di file terpisah)

interface InputGroupProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
}

// Komponen reusable untuk text input
const InputGroup: React.FC<InputGroupProps> = ({ label, id, type = "text", placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        name={id}
        id={id}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  </div>
);

interface SelectGroupProps {
  label: string;
  id: string;
  children: React.ReactNode;
}

// Komponen reusable untuk select/dropdown
const SelectGroup: React.FC<SelectGroupProps> = ({ label, id, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative mt-1">
      <select
        id={id}
        name={id}
        className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        defaultValue=""
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  </div>
);


// --- Halaman Utama ---

export default function AddDataPage() {
  return (
    // Asumsi layout utama (Sidebar + Main) sudah ada di 'layout.tsx'
    // 'p-8' dan 'ml-64' berasal dari layout utama Anda sebelumnya
    <div >
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        Data Person &gt; <span className="font-medium text-gray-700">Add Data</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900">Add Data</h1>
      <p className="mb-6 text-sm text-gray-600">XXXXXXX</p>

      {/* Form Card */}
      <div className="max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Di aplikasi nyata, ini akan menjadi tag <form> */}
        <div className="space-y-6">
          <SelectGroup label="Role" id="role">
            <option value="" disabled>Select</option>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="alumni">Alumni</option>
            <option value="dosen">Dosen</option>
          </SelectGroup>

          <InputGroup
            label="Email"
            id="email"
            type="email"
            placeholder="e.g., mailmail@mail.ugm.ac.id"
          />

          <InputGroup
            label="Nama"
            id="nama"
            placeholder="e.g., Asri Halimino"
          />

          <SelectGroup label="Program Studi" id="program_studi">
            <option value="" disabled>Select</option>
            <option value="ti">Teknologi Informasi</option>
            <option value="te">Teknik Elektro</option>
            <option value="tb">Teknik Biomedis</option>
          </SelectGroup>

          <InputGroup
            label="NIM/NIP"
            id="nim_nip"
            placeholder="e.g., F04"
          />

          {/* Tombol Aksi */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Create Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}