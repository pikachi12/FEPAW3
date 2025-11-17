"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "react-feather";

interface InputGroupProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const InputGroup = ({ label, id, type = "text", placeholder, value, onChange }: InputGroupProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500"
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
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative mt-1">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 shadow-sm appearance-none"
      >
        {children}
      </select>

      {/* Custom Chevron */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <ChevronDown className="h-4 w-4 text-gray-700" />
      </div>
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

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed");
      setLoading(false);
      return;
    }

    alert(mode === "edit" ? "Updated!" : "Created!");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <SelectGroup label="Role" id="role" value={role} onChange={setRole}>
        <option value="">Select</option>
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
        placeholder="Nama lengkap"
        value={nama}
        onChange={setNama}
      />

      <SelectGroup label="Program Studi" id="prodi" value={prodi} onChange={setProdi}>
        <option value="" disabled>Select</option>
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

      <div className="flex justify-end pt-4">
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="rounded-lg bg-orange-600 px-6 py-2 text-white hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Data"}
        </button>
      </div>
    </div>
  );
}
