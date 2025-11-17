"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Combobox } from "@headlessui/react";
import { ChevronDown, X } from "react-feather";

// --- Sub-komponen ---
interface SelectGroupProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  label,
  id,
  value,
  onChange,
  children,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative mt-1">
      <select
        id={id}
        name={id}
        className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  </div>
);

interface TextAreaGroupProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

const TextAreaGroup: React.FC<TextAreaGroupProps> = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  rows = 5,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <textarea
        id={id}
        name={id}
        rows={rows}
        className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

interface FileUploadGroupProps {
  label: string;
  id: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  currentFile?: string | null;
  multiple?: boolean;
  onMultipleChange?: (files: File[]) => void;
}

const FileUploadGroup: React.FC<FileUploadGroupProps> = ({
  label,
  id,
  accept,
  onChange,
  currentFile,
  multiple = false,
  onMultipleChange,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (multiple && onMultipleChange) {
      const fileArray = Array.from(files);
      setFileNames(fileArray.map((f) => f.name));
      onMultipleChange(fileArray);
    } else {
      const file = files[0];
      setFileName(file?.name || "");
      onChange?.(file || null);
    }
  };

  const removeFile = (index: number) => {
    if (multiple && onMultipleChange) {
      const newNames = fileNames.filter((_, i) => i !== index);
      setFileNames(newNames);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        {multiple && fileNames.length > 0 && (
          <div className="mb-2 space-y-1">
            {fileNames.map((name, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded bg-gray-50 px-3 py-1 text-sm"
              >
                <span className="flex-1 truncate">{name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex">
          <input
            type="text"
            className="flex-1 rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
            placeholder={fileName || currentFile || "No file chosen"}
            disabled
          />
          <label
            htmlFor={`file-${id}`}
            className="cursor-pointer rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Pilih File
          </label>
          <input
            id={`file-${id}`}
            name={id}
            type="file"
            accept={accept}
            multiple={multiple}
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
interface ProjectFormProps {
  initialData?: any;
  mode?: "add" | "edit";
  projectId?: string;
}

export default function ProjectForm({
  initialData,
  mode = "add",
  projectId,
}: ProjectFormProps) {
  const [loading, setLoading] = useState(false);

  // Form states
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [ketua, setKetua] = useState<string | null>("");
  const [dosen, setDosen] = useState<string | null>("");
  const [abstrak, setAbstrak] = useState("");
  const [ketuaQuery, setKetuaQuery] = useState("");
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Alumni list (instead of teams)
  const [alumni, setAlumni] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);

  // Anggota search & selected
  const [searchAnggota, setSearchAnggota] = useState("");
  const [selectedAnggota, setSelectedAnggota] = useState<any[]>([]);
  const [searchDosen, setSearchDosen] = useState("");

  const handleAddAnggota = (user: any) => {
    if (selectedAnggota.length >= 4) {
      toast.error("Maksimal 4 anggota", { duration: 5000 });
      return;
    }
    if (user.id === ketua) {
      toast.error("Ketua tidak boleh menjadi anggota", { duration: 5000 });
      return;
    }
    setSelectedAnggota((prev) => [...prev, user]);
  };

  const removeAnggota = (id: string) => {
    setSelectedAnggota((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumniRes, lecturersRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users?role=alumni`,
            { credentials: "include" }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users?role=dosen`,
            { credentials: "include" }
          ),
        ]);

        const alumniData = await alumniRes.json();
        console.log(alumniData);
        const lecturersData = await lecturersRes.json();
        console.log(lecturersData);

        setAlumni(alumniData || []);
        setLecturers(lecturersData || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!initialData) {
      setKetua("");
      setDosen("");
      return;
    }
    setJudul(initialData.judul || "");
    setKategori(initialData.kategori || "");
    // Cari id ketua dari alumni jika initialData.ketua berupa objek atau string nama/email
    let ketuaId = "";
    if (initialData.ketua) {
      if (typeof initialData.ketua === "object" && initialData.ketua.id) {
        ketuaId = initialData.ketua.id;
      } else if (typeof initialData.ketua === "string") {
        const found = alumni.find((a) =>
          a.id === initialData.ketua ||
          a.name === initialData.ketua ||
          a.nama === initialData.ketua ||
          a.email === initialData.ketua
        );
        ketuaId = found ? found.id : "";
      }
    }
    setKetua(ketuaId);
    // Dosen tetap
    setDosen(initialData.dosen?.id || initialData.dosen?._id || initialData.dosen || "");
    setAbstrak(initialData.abstrak || "");

    if (initialData.anggota) {
      setSelectedAnggota(initialData.anggota);
    }
  }, [initialData, alumni]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("kategori", kategori);
      formData.append("ketua", ketua ?? "");
      formData.append("dosen", dosen ?? "");
      formData.append("abstrak", abstrak);

      formData.append(
        "anggota",
        JSON.stringify(selectedAnggota.map((a) => a.id))
      );

      if (proposalFile) {
        formData.append("proposal", proposalFile);
      }

      imageFiles.forEach((file) => {
        formData.append("hasil", file);
      });

      const url =
        mode === "edit"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/capstones/${projectId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/capstones`;

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Gagal menyimpan project", {
          duration: 5000,
        });
        return;
      }

      toast.success(
        mode === "edit"
          ? "Project berhasil diupdate!"
          : "Project berhasil dibuat!",
        { duration: 5000 }
      );

      if (mode === "add") {
        setTimeout(() => {
          window.location.href = "/admin/dashboard/capstone-projects/add-project";
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan project",
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl rounded-lg border border-gray-200 bg-white p-6"
    >
      <div className="space-y-6">
        {/* JUDUL */}
        <div>
          <label
            htmlFor="judul"
            className="block text-sm font-medium text-gray-700"
          >
            Judul Proyek
          </label>
          <input
            id="judul"
            type="text"
            className="w-full border rounded-md px-3 py-2 mb-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="e.g., Sistem Transportasi Cerdas"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>

        {/* KATEGORI + KETUA */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectGroup
            label="Kategori"
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Pengolahan Sampah">Pengolahan Sampah</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Pendidikan">Pendidikan</option>
            <option value="Transportasi Ramah Lingkungan">
              Transportasi Ramah Lingkungan
            </option>
          </SelectGroup>

          {/* Combobox Headless UI untuk ketua */}
          <div>
            <label htmlFor="ketua" className="block text-sm font-medium text-gray-700">
              Ketua
            </label>
            <Combobox value={ketua ?? ""} onChange={setKetua} name="ketua">
              <div className="relative mt-1">
                <Combobox.Input
                  className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-gray-400 focus:ring-gray-200"
                  displayValue={(id: string) => {
                    const ketuaObj = alumni.find((a) => a.id === id);
                    return ketuaObj ? (ketuaObj.name || ketuaObj.nama || ketuaObj.email) : "";
                  }}
                  onChange={e => setKetuaQuery(e.target.value)}
                  placeholder="Cari atau pilih ketua"
                  required
                />
                <Combobox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white border border-gray-300 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {alumni.filter((a) =>
                    (a.name || a.nama || a.email)?.toLowerCase().includes(ketuaQuery.toLowerCase())
                  ).length === 0 ? (
                    <div className="cursor-default select-none px-4 py-2 text-gray-700">
                      Tidak ada hasil
                    </div>
                  ) : (
                    alumni.filter((a) =>
                      (a.name || a.nama || a.email)?.toLowerCase().includes(ketuaQuery.toLowerCase())
                    ).map((a) => (
                      <Combobox.Option
                        key={a.id}
                        value={a.id}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-200 text-gray-900' : 'text-gray-900'}`
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
        </div>

        {/* ANGGOTA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anggota (maks 4)
          </label>

          <input
            value={searchAnggota}
            onChange={(e) => setSearchAnggota(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mb-2"
            placeholder="Search anggota..."
          />

          {searchAnggota && (
            <div className="border rounded-md max-h-40 overflow-y-auto">
              {alumni
                .filter((p) =>
                  (p.name || p.nama)
                    ?.toLowerCase()
                    .includes(searchAnggota.toLowerCase())
                )
                .filter((p) => p.id !== ketua)
                .filter((p) => !selectedAnggota.some((s) => s.id === p.id))
                .slice(0, 10)
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleAddAnggota(p)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {p.name || p.nama} ({p.email})
                  </div>
                ))}
            </div>
          )}

          <div className="mt-3 space-y-1">
            {selectedAnggota.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between border px-3 py-2 rounded-md"
              >
                <span>{a.name || a.nama}</span>
                <button
                  type="button"
                  onClick={() => removeAnggota(a.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* DOSEN */}
        <div>
          {/* Combobox Headless UI untuk dosen */}
          <label htmlFor="dosen" className="block text-sm font-medium text-gray-700 mb-1">Dosen Pembimbing</label>
          <Combobox value={dosen} onChange={setDosen} name="dosen">
            <div className="relative mt-1">
              <Combobox.Input
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-gray-400 focus:ring-gray-200"
                displayValue={(id: string | null) => {
                  const dosenObj = lecturers.find((l) => l.id === id);
                  return dosenObj ? (dosenObj.name || dosenObj.nama || dosenObj.email) : "";
                }}
                onChange={e => setSearchDosen(e.target.value)}
                placeholder="Cari atau pilih dosen"
                required
              />
              <Combobox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white border border-gray-300 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {lecturers.filter((l) =>
                  (l.name || l.nama || l.email)?.toLowerCase().includes(searchDosen.toLowerCase())
                ).length === 0 ? (
                  <div className="cursor-default select-none px-4 py-2 text-gray-700">
                    Tidak ada hasil
                  </div>
                ) : (
                  lecturers.filter((l) =>
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

        {/* ABSTRAK */}
        <TextAreaGroup
          label="Abstrak"
          id="abstrak"
          placeholder="Deskripsi lengkap proyek..."
          value={abstrak}
          onChange={(e) => setAbstrak(e.target.value)}
        />

        {/* PROPOSAL */}
        <FileUploadGroup
          label="Proposal (PDF)"
          id="proposal"
          accept=".pdf"
          onChange={setProposalFile}
          currentFile={initialData?.proposal}
        />

        {/* GAMBAR */}
        <FileUploadGroup
          label="Gambar Hasil (Multiple)"
          id="hasil"
          accept="image/*"
          multiple
          onMultipleChange={setImageFiles}
        />

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Project"}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-lg border border-orange-600 bg-white px-6 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
