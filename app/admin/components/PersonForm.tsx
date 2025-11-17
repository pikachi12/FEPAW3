"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import toast from "react-hot-toast";

interface InputGroupProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const InputGroup = ({ label, id, type = "text", placeholder, value, onChange }: InputGroupProps) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
        transition-all duration-150
        focus:border-blue-500 focus:ring-2 focus:ring-blue-200
      "
    />
  </div>
);

interface SelectGroupProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

const SelectGroup = ({ label, id, value, onChange, children }: SelectGroupProps) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm
          appearance-none
          transition-all duration-150
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
        "
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

export default function PersonForm({
  initialData,
  mode = "add",
  personId,
}: {
  initialData?: any;
  mode?: "add" | "edit";
  personId?: string;
}) {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");
  const [nim, setNim] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    setRole(initialData.role || "");
    setEmail(initialData.email || "");
    setNama(initialData.name || "");
    setProdi(initialData.prodi || "");
    setNim(initialData.nim || "");
  }, [initialData]);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = { role, email, name: nama, prodi, nim };

    const url =
      mode === "edit"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/${personId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/users`;

    const method = mode === "edit" ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast.error("Gagal menyimpan data!", { duration: 5000 });
        return;
      }

      toast.success(mode === "edit" ? "Data berhasil diupdate!" : "Data berhasil dibuat!", { duration: 5000 });
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="space-y-6">

    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      {mode === "edit" ? "Edit Person" : "Add New Person"}
    </h3>

    <div className="space-y-5">

      <SelectGroup label="Role" id="role" value={role} onChange={setRole}>
        <option value="" disabled>Select Role</option>
        <option value="mahasiswa">Mahasiswa</option>
        <option value="alumni">Alumni</option>
        <option value="dosen">Dosen</option>
      </SelectGroup>

      <InputGroup
        label="Email"
        id="email"
        type="email"
        placeholder="mail@mail.ugm.ac.id"
        value={email}
        onChange={setEmail}
      />

      <InputGroup
        label="Nama"
        id="nama"
        placeholder="Nama Lengkap"
        value={nama}
        onChange={setNama}
      />

      <SelectGroup
        label="Program Studi"
        id="prodi"
        value={prodi}
        onChange={setProdi}
      >
        <option value="" disabled>Pilih Prodi</option>
        <option value="Teknologi Informasi">Teknologi Informasi</option>
        <option value="Teknik Elektro">Teknik Elektro</option>
        <option value="Teknik Biomedis">Teknik Biomedis</option>
      </SelectGroup>

      <InputGroup
        label="NIM/NIP"
        id="nim"
        placeholder="23/518xxx"
        value={nim}
        onChange={setNim}
      />
    </div>

    <div className="flex justify-end pt-4">
      <button
        disabled={loading}
        onClick={handleSubmit}
        className="
          rounded-lg bg-orange-600 px-6 py-2 text-white text-sm font-medium
          hover:bg-orange-700 transition disabled:opacity-50
        "
      >
        {loading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Data"}
      </button>
    </div>
  </div>
);
}