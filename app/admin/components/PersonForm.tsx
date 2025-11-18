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
  disabled?: boolean;
}

const SelectGroup = ({ label, id, value, onChange, children, disabled }: SelectGroupProps) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
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
  const [nimOrNip, setNimOrNip] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    setRole(initialData.role || "");
    setEmail(initialData.email || "");
    setNama(initialData.name || "");
    setProdi(initialData.prodi || "");
    if (initialData.role === "dosen") {
      setNimOrNip(initialData.nip || "");
    } else {
      setNimOrNip(initialData.nim || "");
    }
  }, [initialData]);

  useEffect(() => {
    if (role === "dosen") {
      setProdi("-");
    }
  }, [role]);

  const validateInput = () => {
    if (!role) {
      toast.error("Role harus dipilih.");
      return false;
    }
    if (!email) {
      toast.error("Email harus diisi.");
      return false;
    }
    if (role === "mahasiswa" || role === "alumni") {
      if (!/^\S+@mail\.ugm\.ac\.id$/.test(email)) {
        toast.error("Email mahasiswa/alumni harus @mail.ugm.ac.id");
        return false;
      }
    } else if (role === "dosen") {
      if (!/^\S+@ugm\.ac\.id$/.test(email)) {
        toast.error("Email dosen harus @ugm.ac.id");
        return false;
      }
    } else {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast.error("Email tidak valid.");
        return false;
      }
    }
    if (!nama || nama.length < 3) {
      toast.error("Nama harus diisi minimal 3 karakter.");
      return false;
    }
    if (role !== "dosen" && !prodi) {
      toast.error("Program Studi harus dipilih.");
      return false;
    }
    if (!nimOrNip || nimOrNip.length < 8) {
      toast.error(role === "dosen" ? "NIP harus diisi minimal 8 karakter dan format sesuai contoh." : "NIM harus diisi minimal 8 karakter dan format sesuai contoh.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
          setTimeout(() => {
            if (role === "dosen") {
              window.location.href = "/admin/dashboard/data-person/all-dosen";
            } else {
              window.location.href = "/admin/dashboard/data-person/all-mahasiswa";
            }
          }, 800);
    if (!validateInput()) return;
    setLoading(true);

    // Jika dosen, prodi tidak dikirim dan gunakan nip
    const payload = role === "dosen"
      ? { role, email, name: nama, nip: nimOrNip }
      : { role, email, name: nama, prodi, nim: nimOrNip };

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
      // Tidak perlu redirect otomatis setelah submit
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
        disabled={role === "dosen"}
      >
        <option value="" disabled>Pilih Prodi</option>
        {role === "dosen" ? <option value="-">-</option> : <>
          <option value="Teknologi Informasi">Teknologi Informasi</option>
          <option value="Teknik Elektro">Teknik Elektro</option>
          <option value="Teknik Biomedis">Teknik Biomedis</option>
        </>}
      </SelectGroup>

      <InputGroup
        label={role === "dosen" ? "NIP" : "NIM"}
        id="nimOrNip"
        placeholder={role === "dosen" ? "1970xxxx" : "23/518xxx"}
        value={nimOrNip}
        onChange={setNimOrNip}
      />
    </div>

    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={handleSubmit}
        className={`rounded-lg px-6 py-2 text-sm font-semibold text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"}`}
        disabled={loading}
      >
        {loading ? "Loading..." : (mode === "edit" ? "Save Changes" : "Create")}
      </button>
      <button
        type="button"
        onClick={() => window.history.back()}
        className="rounded-lg border border-orange-600 bg-white px-6 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  </div>
);
}