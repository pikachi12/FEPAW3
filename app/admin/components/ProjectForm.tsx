"use client";

import { useState, useEffect } from "react";
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
        className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
            className="flex-1 rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 shadow-sm"
            placeholder={fileName || currentFile || "No file chosen"}
            disabled
          />
          <label
            htmlFor={`file-${id}`}
            className="cursor-pointer rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
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
  const [ketua, setKetua] = useState("");
  const [dosen, setDosen] = useState("");
  const [abstrak, setAbstrak] = useState("");
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Alumni list (instead of teams)
  const [alumni, setAlumni] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);

  // Anggota search & selected
  const [searchAnggota, setSearchAnggota] = useState("");
  const [selectedAnggota, setSelectedAnggota] = useState<any[]>([]);

  const handleAddAnggota = (user: any) => {
    if (selectedAnggota.length >= 4) {
      alert("Maksimal 4 anggota");
      return;
    }
    if (user.id === ketua) {
      alert("Ketua tidak boleh menjadi anggota");
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

        setAlumni(alumniData|| []);
        setLecturers(lecturersData || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!initialData) return;

    setJudul(initialData.judul || "");
    setKategori(initialData.kategori || "");
    setKetua(initialData.ketua?._id || initialData.ketua || "");
    setDosen(initialData.dosen?._id || initialData.dosen || "");
    setAbstrak(initialData.abstrak || "");

    if (initialData.anggota) {
      setSelectedAnggota(initialData.anggota);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("kategori", kategori);
      formData.append("ketua", ketua);
      formData.append("dosen", dosen);
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
        throw new Error(error.message || "Failed to save project");
      }

      alert(mode === "edit" ? "Project updated!" : "Project created!");

      if (mode === "add") {
        window.location.href = "/admin/dashboard/capstone-projects/add-project";
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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

          <SelectGroup
            label="Ketua Tim"
            id="ketua"
            value={ketua}
            onChange={(e) => setKetua(e.target.value)}
          >
            <option value="" disabled>
              Select
            </option>
            {alumni.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nama || user.name}
              </option>
            ))}
          </SelectGroup>
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
        <SelectGroup
          label="Dosen Pembimbing"
          id="dosen"
          value={dosen}
          onChange={(e) => setDosen(e.target.value)}
        >
          <option value="" disabled>
            Select
          </option>
          {lecturers.map((lecturer) => (
            <option key={lecturer.id} value={lecturer.id}>
              {lecturer.nama || lecturer.name}
            </option>
          ))}
        </SelectGroup>

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
            type="button"
            onClick={() => window.history.back()}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>
    </form>
  );
}
