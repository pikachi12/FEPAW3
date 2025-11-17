"use client";

import { useEffect, useState } from "react";

interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface TeamFormProps {
  mode?: "add" | "edit";
  groupId?: string; // hanya untuk edit
  initialData?: any; // data group saat edit
}

export default function TeamForm({ mode = "add", groupId, initialData }: TeamFormProps) {
  const isEditMode = mode === "edit";

  // -------------------- Form State --------------------
  const [tema, setTema] = useState("");
  const [tahun, setTahun] = useState("");
  const [namaTim, setNamaTim] = useState("");
  const [selectedKetua, setSelectedKetua] = useState("");
  const [selectedDosen, setSelectedDosen] = useState("");
  const [selectedAnggota, setSelectedAnggota] = useState<UserOption[]>([]);
  const [searchAnggota, setSearchAnggota] = useState("");

  const [ketuaList, setKetuaList] = useState<UserOption[]>([]);
  const [anggotaList, setAnggotaList] = useState<UserOption[]>([]);
  const [dosenList, setDosenList] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);

  // -------------------- Fetch Users --------------------
  const fetchMahasiswa = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users?role=mahasiswa,alumni`,
      { credentials: "include" }
    );
    const json = await res.json();
    const data = json.data || json;
    setKetuaList(data);
    setAnggotaList(data);
  };

  const fetchDosen = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users?role=dosen`,
      { credentials: "include" }
    );
    const json = await res.json();
    setDosenList(json.data || json);
  };

  useEffect(() => {
    fetchMahasiswa();
    fetchDosen();
  }, []);

  // -------------------- Prefill saat EDIT --------------------
  useEffect(() => {
    if (!initialData) return;

    setTema(initialData.tema || "");
    setTahun(initialData.tahun?.toString() || "");
    setNamaTim(initialData.namaTim || "");

    setSelectedKetua(initialData.ketua?.id || "");
    setSelectedDosen(initialData.dosen?.id || "");

    setSelectedAnggota(
      initialData.anggota?.map((a: any) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        role: a.role,
      })) || []
    );
  }, [initialData]);

  // -------------------- Add/remove anggota --------------------
  const handleAddAnggota = (person: UserOption) => {
    if (selectedAnggota.find((a) => a.id === person.id)) return;
    if (selectedAnggota.length >= 4) return alert("Maksimal 4 anggota!");

    setSelectedAnggota([...selectedAnggota, person]);
  };

  const removeAnggota = (id: string) =>
    setSelectedAnggota(selectedAnggota.filter((a) => a.id !== id));

  // -------------------- Submit --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      tema,
      namaTim,
      tahun: Number(tahun),
      ketua: selectedKetua,
      anggota: selectedAnggota.map((a) => a.id),
      dosen: selectedDosen,
    };

    const url =
      mode === "edit"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/groups/${groupId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/groups`;

    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed");

      alert(isEditMode ? "Team updated!" : "Team created!");
    } catch {
      alert("Failed to save team");
    }

    setLoading(false);
  };

  // -------------------- RENDER --------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl rounded-lg border p-6 bg-white shadow-sm space-y-6"
    >
      {/* Tema + Tahun */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Tema</label>
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Pengolahan Sampah">Pengolahan Sampah</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Smart City">Smart City</option>
            <option value="Transportasi Ramah Lingkungan">Transportasi Ramah Lingkungan</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Tahun</label>
          <input
            type="number"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="2025"
          />
        </div>
      </div>

      {/* Ketua */}
      <div>
        <label className="text-sm font-medium">Ketua</label>
        <select
          value={selectedKetua}
          onChange={(e) => setSelectedKetua(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">Select Ketua</option>
          {ketuaList.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {/* Nama Tim */}
      <div>
        <label className="text-sm font-medium">Nama Tim</label>
        <input
          value={namaTim}
          onChange={(e) => setNamaTim(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Team A"
        />
      </div>

      {/* Anggota */}
      <div>
        <label className="text-sm font-medium">Anggota</label>

        <input
          value={searchAnggota}
          onChange={(e) => setSearchAnggota(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-2"
          placeholder="Search anggota..."
        />

        <div className="border rounded-md max-h-40 overflow-y-auto">
          {anggotaList
            .filter(
              (p) =>
                p.name.toLowerCase().includes(searchAnggota.toLowerCase()) &&
                p.id !== selectedKetua &&
                !selectedAnggota.some((a) => a.id === p.id)
            )
            .slice(0, 10)
            .map((p) => (
              <div
                key={p.id}
                onClick={() => handleAddAnggota(p)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {p.name} ({p.email})
              </div>
            ))}
        </div>

        {/* Selected anggota */}
        <div className="mt-3 space-y-1">
          {selectedAnggota.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between border px-3 py-2 rounded-md"
            >
              <span>{a.name}</span>
              <button
                type="button"
                onClick={() => removeAnggota(a.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dosen */}
      <div>
        <label className="text-sm font-medium">Dosen Pembimbing</label>
        <select
          value={selectedDosen}
          onChange={(e) => setSelectedDosen(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">Select Dosen</option>
          {dosenList.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`rounded-lg px-6 py-2 text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {loading
            ? "Saving..."
            : isEditMode
            ? "Save Changes"
            : "Create Team"}
        </button>
      </div>
    </form>
  );
}
