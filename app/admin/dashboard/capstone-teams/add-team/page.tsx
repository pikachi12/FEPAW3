import { ChevronDown, PlusCircle } from 'react-feather';
import React from 'react';

// --- Sub-komponen Input dan Select yang Reusable ---
// (Anda bisa mengimpor ini dari satu file terpusat jika sudah dibuat)

interface InputGroupProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  className?: string;
  readOnly?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, id, type = "text", placeholder, className, readOnly = false }) => (
  <div className={className}>
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
        readOnly={readOnly}
      />
    </div>
  </div>
);

interface SelectGroupProps {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ label, id, children, className }) => (
  <div className={className}>
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


// --- Halaman Utama Add Team ---

export default function AddTeamPage() {
  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        Capstone Teams &gt; <span className="font-medium text-gray-700">Add Team</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900">Add Team</h1>
      <p className="mb-6 text-sm text-gray-600">XXXXXXX</p>

      {/* Form Card */}
      <div className="max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          
          {/* Baris 1: Tema & Role */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SelectGroup label="Tema" id="tema">
              <option value="" disabled>Select</option>
              <option value="pengolahan_sampah">Pengolahan Sampah</option>
              <option value="kesehatan">Kesehatan</option>
              <option value="pendidikan">Pendidikan</option>
            </SelectGroup>
            <SelectGroup label="Role" id="role_ketua">
              <option value="" disabled>Select</option>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="alumni">Alumni</option>
            </SelectGroup>
          </div>

          {/* Email Ketua Tim */}
          <InputGroup
            label="Email Ketua Tim"
            id="email_ketua"
            type="email"
            placeholder="e.g., mailmail@mail.ugm.ac.id"
          />

          {/* Nama Ketua Tim */}
          <InputGroup
            label="Nama Ketua Tim"
            id="nama_ketua"
            placeholder="e.g., Asri Halimino"
            readOnly // Biasanya diisi otomatis setelah email dipilih
          />

          {/* Nama Tim Capstone */}
          <InputGroup
            label="Nama Tim Capstone"
            id="nama_tim"
            placeholder="e.g., F04"
          />

          {/* Tahun */}
          <InputGroup
            label="Tahun"
            id="tahun"
            type="number"
            placeholder="e.g., 2022"
          />

          {/* Detail Anggota Tim */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Detail Anggota Tim</h3>
            <div className="space-y-4">
              <InputGroup label="Nama Anggota 1" id="anggota_1" placeholder="e.g., Asri Halimino" />
              <InputGroup label="Nama Anggota 2" id="anggota_2" placeholder="e.g., Asri Halimino" />
              <InputGroup label="Nama Anggota 3" id="anggota_3" placeholder="e.g., Asri Halimino" />
              <InputGroup label="Nama Anggota 4" id="anggota_4" placeholder="e.g., Asri Halimino" />
              {/* Anda bisa menambahkan tombol untuk menambah anggota dinamis di sini */}
              {/* <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <PlusCircle className="h-5 w-5" /> Tambah Anggota
              </button> */}
            </div>
          </div>

          {/* Detail Dosen Pembimbing */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Detail Dosen Pembimbing</h3>
            <InputGroup
              label="Nama Dosen"
              id="nama_dosen"
              placeholder="e.g., Asri Halimino"
            />
            {/* Anda bisa menambahkan Email Dosen atau Select Dosen di sini */}
          </div>


          {/* Tombol Aksi */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Create Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}