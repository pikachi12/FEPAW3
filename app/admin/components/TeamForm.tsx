"use client"; // Form memerlukan state, jadi harus Client Component

import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { type TeamData } from '@/lib/dummy-data'; // Impor tipe data

// --- Sub-komponen Input dan Select (diasumsikan sudah ada/dibuat) ---
// (Anda bisa pindahkan ini ke file terpisah agar lebih rapi)
interface InputGroupProps {
  label: string; id: string; type?: string; placeholder: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}
const InputGroup: React.FC<InputGroupProps> = ({ label, id, type = "text", placeholder, value, onChange, readOnly = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1">
      <input type={type} name={id} id={id} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder={placeholder} value={value} onChange={onChange} readOnly={readOnly} />
    </div>
  </div>
);

interface SelectGroupProps {
  label: string; id: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}
const SelectGroup: React.FC<SelectGroupProps> = ({ label, id, value, onChange, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative mt-1">
      <select id={id} name={id} className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        value={value} onChange={onChange}>
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  </div>
);
// --- Akhir sub-komponen ---


// Props untuk form, 'initialData' bersifat opsional
interface TeamFormProps {
  initialData?: TeamData;
}

export default function TeamForm({ initialData }: TeamFormProps) {
  // Tentukan apakah ini mode 'edit'
  const isEditMode = !!initialData;

  // Gunakan state untuk mengelola semua field form
  // Isi state dengan 'initialData' jika ada (mode edit), atau string kosong (mode add)
  const [tema, setTema] = useState(initialData?.tema || "");
  const [role, setRole] = useState(initialData?.roleKetua || "");
  const [emailKetua, setEmailKetua] = useState(initialData?.emailKetua || "");
  const [namaKetua, setNamaKetua] = useState(initialData?.namaKetua || "");
  const [namaTim, setNamaTim] = useState(initialData?.namaTim || "");
  const [tahun, setTahun] = useState(initialData?.tahun.toString() || "");
  
  // Ambil data anggota & dosen dari struktur data yang kompleks
  const [anggota1, setAnggota1] = useState(initialData?.anggota[0]?.nama || "");
  const [anggota2, setAnggota2] = useState(initialData?.anggota[1]?.nama || "");
  const [anggota3, setAnggota3] = useState(initialData?.anggota[2]?.nama || "");
  const [anggota4, setAnggota4] = useState(initialData?.anggota[3]?.nama || "");
  const [namaDosen, setNamaDosen] = useState(initialData?.dosenPembimbing?.nama || "");

  // Handler untuk form submit (bisa ditambahkan nanti)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika untuk mengirim data (bisa ke API)
    console.log({
      tema, role, emailKetua, namaKetua, namaTim, tahun,
      anggota1, anggota2, anggota3, anggota4, namaDosen
    });
    alert(isEditMode ? "Data tim diperbarui!" : "Tim baru dibuat!");
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectGroup label="Tema" id="tema" value={tema} onChange={(e) => setTema(e.target.value)}>
            <option value="" disabled>Select</option>
            <option value="Pengolahan Sampah">Pengolahan Sampah</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Pendidikan">Pendidikan</option>
          </SelectGroup>
          <SelectGroup label="Role" id="role_ketua" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="" disabled>Select</option>
            <option value="Mahasiswa">Mahasiswa</option>
            <option value="Alumni">Alumni</option>
          </SelectGroup>
        </div>

        <InputGroup
          label="Email Ketua Tim"
          id="email_ketua"
          type="email"
          placeholder="e.g., mailmail@mail.ugm.ac.id"
          value={emailKetua}
          onChange={(e) => setEmailKetua(e.target.value)}
        />
        <InputGroup
          label="Nama Ketua Tim"
          id="nama_ketua"
          placeholder="e.g., Asri Halimino"
          value={namaKetua}
          onChange={(e) => setNamaKetua(e.target.value)}
          readOnly // Mungkin read-only, diisi dari data email
        />
        <InputGroup
          label="Nama Tim Capstone"
          id="nama_tim"
          placeholder="e.g., F04"
          value={namaTim}
          onChange={(e) => setNamaTim(e.target.value)}
        />
        <InputGroup
          label="Tahun"
          id="tahun"
          type="number"
          placeholder="e.g., 2022"
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
        />

        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-800">Detail Anggota Tim</h3>
          <div className="space-y-4">
            <InputGroup label="Nama Anggota 1" id="anggota_1" placeholder="e.g., Asri Halimino" value={anggota1} onChange={(e) => setAnggota1(e.target.value)} />
            <InputGroup label="Nama Anggota 2" id="anggota_2" placeholder="e.g., Asri Halimino" value={anggota2} onChange={(e) => setAnggota2(e.target.value)} />
            <InputGroup label="Nama Anggota 3" id="anggota_3" placeholder="e.g., Asri Halimino" value={anggota3} onChange={(e) => setAnggota3(e.target.value)} />
            <InputGroup label="Nama Anggota 4" id="anggota_4" placeholder="e.g., Asri Halimino" value={anggota4} onChange={(e) => setAnggota4(e.target.value)} />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-800">Detail Dosen Pembimbing</h3>
          <InputGroup
            label="Nama Dosen"
            id="nama_dosen"
            placeholder="e.g., Asri Halimino"
            value={namaDosen}
            onChange={(e) => setNamaDosen(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            {/* Teks tombol berubah berdasarkan mode */}
            {isEditMode ? 'Save' : 'Create Team'}
          </button>
        </div>
      </div>
    </form>
  );
}