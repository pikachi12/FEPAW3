"use client"; // Form memerlukan state

import { useState } from 'react';
import { ChevronDown, Upload } from 'react-feather';
import { type ProjectData } from '@/lib/dummy-data'; // Impor tipe data

// --- Sub-komponen (asumsi sudah dibuat/bisa di-copas dari add-project) ---
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

interface TextAreaGroupProps {
  label: string; id: string; placeholder: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}
const TextAreaGroup: React.FC<TextAreaGroupProps> = ({ label, id, placeholder, value, onChange, rows = 5 }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1">
      <textarea id={id} name={id} rows={rows} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder={placeholder} value={value} onChange={onChange}></textarea>
    </div>
  </div>
);

interface FileUploadGroupProps {
  label: string; id: string; placeholder: string;
  // State file tidak bisa dikontrol langsung via 'value', 
  // jadi kita biarkan tidak terkontrol untuk kesederhanaan
}
const FileUploadGroup: React.FC<FileUploadGroupProps> = ({ label, id, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 flex">
      <input
        type="text"
        className="flex-1 rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 shadow-sm"
        placeholder={placeholder}
        disabled // Placeholder, akan diisi oleh JS saat file dipilih
      />
      <label htmlFor={`file-${id}`} className="cursor-pointer rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100">
        Pilih File
      </label>
      <input id={`file-${id}`} name={id} type="file" className="sr-only" />
    </div>
  </div>
);
// --- Akhir sub-komponen ---


interface ProjectFormProps {
  initialData?: ProjectData; // Opsional, untuk mode edit
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const isEditMode = !!initialData;

  // Isi state dengan initialData jika ada
  const [tema, setTema] = useState(initialData?.tema || "");
  const [namaTim, setNamaTim] = useState(initialData?.namaTim || "");
  const [abstrak, setAbstrak] = useState(initialData?.abstrak || "");
  // State file biasanya ditangani secara terpisah
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ tema, namaTim, abstrak });
    alert(isEditMode ? "Proyek diperbarui!" : "Proyek baru dibuat!");
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
          <SelectGroup label="Nama Tim Capstone" id="nama_tim" value={namaTim} onChange={(e) => setNamaTim(e.target.value)}>
            <option value="" disabled>Select</option>
            <option value="F04">Tim F04</option>
            <option value="F05">Tim F05</option>
            <option value="F06">Tim F06</option>
          </SelectGroup>
        </div>

        <TextAreaGroup
          label="Abstrak"
          id="abstrak"
          placeholder="e.g., lorem ipsum"
          value={abstrak}
          onChange={(e) => setAbstrak(e.target.value)}
        />

        <FileUploadGroup
          label="Hasil"
          id="hasil_foto"
          placeholder="Pilih Foto Hasil"
        />

        <FileUploadGroup
          label="Proposal"
          id="proposal_file"
          placeholder="Pilih File Proposal"
        />

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            {isEditMode ? 'Save' : 'Create Project'}
          </button>
        </div>
      </div>
    </form>
  );
}