"use client";

import { Combobox } from "@headlessui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserOption {
  id: string;
  name: string;
  nama?: string;
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
  const [selectedKetua, setSelectedKetua] = useState<string | null>(null);
  const [selectedDosen, setSelectedDosen] = useState<string | null>(null);
  const [selectedAnggota, setSelectedAnggota] = useState<UserOption[]>([]);
  const [searchAnggota, setSearchAnggota] = useState("");
  const [searchDosen, setSearchDosen] = useState("");
  const [ketuaQuery, setKetuaQuery] = useState("");

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

    setSelectedKetua(initialData.ketua?.id ?? null);
    setSelectedDosen(initialData.dosen?.id ?? null);

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
    if (selectedAnggota.length >= 4) {
      toast.error("Maksimal 4 anggota!", { duration: 5000 });
      return;
    }

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

      if (!res.ok) {
        toast.error("Gagal menyimpan tim!", { duration: 5000 });
        setLoading(false);
        return;
      }
      toast.success(isEditMode ? "Team berhasil diupdate!" : "Team berhasil dibuat!", { duration: 5000 });
      setTimeout(() => {
        window.location.href = "/admin/dashboard/capstone-teams/all-teams";
      }, 800);
    } catch {
      toast.error("Gagal menyimpan tim!", { duration: 5000 });
      setLoading(false);
    }
  };

  // -------------------- RENDER --------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl rounded-lg border p-6 bg-white space-y-6"
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
        <Combobox value={selectedKetua} onChange={setSelectedKetua} name="ketua">
          <div className="relative mt-1">
            <Combobox.Input
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-gray-400 focus:ring-gray-200"
              displayValue={(id: string | null) => {
                const ketuaObj = anggotaList.find((a) => a.id === id);
                return ketuaObj ? (ketuaObj.name || ketuaObj.nama || ketuaObj.email) : "";
              }}
              onChange={e => setKetuaQuery(e.target.value)}
              placeholder="Cari atau pilih ketua"
              required
            />
            <Combobox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white border border-gray-300 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {anggotaList.filter((a) =>
                (a.name || a.nama || a.email)?.toLowerCase().includes(ketuaQuery.toLowerCase())
              ).length === 0 ? (
                <div className="cursor-default select-none px-4 py-2 text-gray-700">
                  Tidak ada hasil
                </div>
              ) : (
                anggotaList.filter((a) =>
                  (a.name || a.nama || a.email)?.toLowerCase().includes(ketuaQuery.toLowerCase())
                ).map((a) => (
                  <Combobox.Option
                    key={a.id}
                    value={a.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`
                    }
                  >
                    {(a.name || a.nama) + (a.email ? ` (${a.email})` : "")}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </div>
        </Combobox>
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

        {searchAnggota && (
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
        )}

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
        <Combobox value={selectedDosen} onChange={setSelectedDosen} name="dosen">
          <div className="relative mt-1">
            <Combobox.Input
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-gray-400 focus:ring-gray-200"
              displayValue={(id: string | null) => {
                const dosenObj = dosenList.find((l) => l.id === id);
                return dosenObj ? (dosenObj.name || dosenObj.nama || dosenObj.email) : "";
              }}
              onChange={e => setSearchDosen(e.target.value)}
              placeholder="Cari atau pilih dosen"
              required
            />
            <Combobox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white border border-gray-300 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {dosenList.filter((l) =>
                (l.name || l.nama || l.email)?.toLowerCase().includes(searchDosen.toLowerCase())
              ).length === 0 ? (
                <div className="cursor-default select-none px-4 py-2 text-gray-700">
                  Tidak ada hasil
                </div>
              ) : (
                dosenList.filter((l) =>
                  (l.name || l.nama || l.email)?.toLowerCase().includes(searchDosen.toLowerCase())
                ).map((l) => (
                  <Combobox.Option
                    key={l.id}
                    value={l.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`
                    }
                  >
                    {(l.name || l.nama) + (l.email ? ` (${l.email})` : "")}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>

      {/* Submit & Cancel */}
      <div className="flex justify-end gap-3 pt-4">
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
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-orange-600 bg-white px-6 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
