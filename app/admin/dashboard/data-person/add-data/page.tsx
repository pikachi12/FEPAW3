'use client';

import { ChevronDown } from 'react-feather';
import React, { useState } from 'react';

// --- Sub-komponen untuk Input ---
// (Diletakkan di file yang sama atau di file terpisah)

interface InputGroupProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

// Komponen reusable untuk text input
const InputGroup: React.FC<InputGroupProps> = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  </div>
);

// --- SelectGroup ---
interface SelectGroupProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  label,
  id,
  value,
  onChange,
  children
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative mt-1">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");
  const [nim, setNim] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!role || !email) {
      alert("Role dan Email wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          role: role,
          name: nama || undefined,
          nim: nim || undefined,
          prodi: prodi || undefined
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal membuat user.");
        setLoading(false);
        return;
      }

      setSuccess("User berhasil dibuat!");
      setTimeout(() => setSuccess(""), 2500);

      // reset form
      setEmail("");
      setRole("");
      setNama("");
      setProdi("");
      setNim("");

    } catch (error) {
      console.error(error);
      alert("Terjadi error.");
    } finally {
      setLoading(false);
    }
  };

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
      <p className="mb-6 text-sm text-gray-600">Tambahkan data person baru ke sistem</p>

      {/* Form Card */}
      <div className="max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-6">
        <SelectGroup label="Role" id="role" value={role} onChange={setRole}>
          <option value="" disabled>Select</option>
          <option value="mahasiswa">Mahasiswa</option>
          <option value="alumni">Alumni</option>
          <option value="dosen">Dosen</option>
        </SelectGroup>

        <InputGroup
          label="Email"
          id="email"
          type="email"
          placeholder="e.g., mail@mail.ugm.ac.id"
          value={email}
          onChange={setEmail}
        />

        <InputGroup
          label="Nama"
          id="nama"
          placeholder="e.g., Asri Halimino"
          value={nama}
          onChange={setNama}
        />

        <SelectGroup label="Program Studi" id="program_studi" value={prodi} onChange={setProdi}>
          <option value="" disabled>Select</option>
          <option value="Teknologi Informasi">Teknologi Informasi</option>
          <option value="Teknik Elektro">Teknik Elektro</option>
          <option value="Teknik Biomedis">Teknik Biomedis</option>
        </SelectGroup>

        <InputGroup
          label="NIM/NIP"
          id="nim_nip"
          placeholder="e.g., 23/518266/TK/57027"
          value={nim}
          onChange={setNim}
        />

        {/* Tombol */} 
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Data"}
          </button>
        </div>

        {success && (
          <p className="text-green-600 text-sm pt-2">{success}</p>
        )}
      </div>
    </div>
    </div>
  );
}