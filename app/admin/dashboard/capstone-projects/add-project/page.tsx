import { ChevronDown, Upload } from 'react-feather';
import React from 'react';

// --- Sub-komponen Input dan Select yang Reusable ---
// Anda bisa mengimpor ini dari satu file jika sudah dibuat secara terpusat

interface InputGroupProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  className?: string; // Tambahkan className untuk fleksibilitas
}

const InputGroup: React.FC<InputGroupProps> = ({ label, id, type = "text", placeholder, className }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        name={id}
        id={id}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  </div>
);

interface SelectGroupProps {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string; // Tambahkan className
}

const SelectGroup: React.FC<SelectGroupProps> = ({ label, id, children, className }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative mt-1">
      <select
        id={id}
        name={id}
        className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        defaultValue=""
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  </div>
);

interface FileUploadGroupProps {
  label: string;
  id: string;
  placeholder: string;
}

const FileUploadGroup: React.FC<FileUploadGroupProps> = ({ label, id, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 flex items-center">
      <input
        type="text"
        className="flex-1 rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder={placeholder}
        readOnly // Biar tidak bisa diketik manual
      />
      <label htmlFor={`file-${id}`} className="cursor-pointer rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100">
        <Upload className="h-4 w-4 inline-block mr-2" /> Pilih File
        <input id={`file-${id}`} name={id} type="file" className="sr-only" />
      </label>
    </div>
  </div>
);


// --- Halaman Utama Add Project ---

export default function AddProjectPage() {
  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        Capstone Projects &gt; <span className="font-medium text-gray-700">Add Project</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900">Add Project</h1>
      <p className="mb-6 text-sm text-gray-600">XXXXXXX</p>

      {/* Form Card */}
      <div className="max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          
          {/* Baris 1: Tema & Nama Tim Capstone */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SelectGroup label="Tema" id="tema">
              <option value="" disabled>Select</option>
              <option value="pengolahan_sampah">Pengolahan Sampah</option>
              <option value="kesehatan">Kesehatan</option>
              <option value="pendidikan">Pendidikan</option>
            </SelectGroup>
            <SelectGroup label="Nama Tim Capstone" id="nama_tim_capstone">
              <option value="" disabled>Select</option>
              <option value="tim_a">Tim A (F04)</option>
              <option value="tim_b">Tim B (F05)</option>
              <option value="tim_c">Tim C (F06)</option>
            </SelectGroup>
          </div>

          {/* Abstrak */}
          <div>
            <label htmlFor="abstrak" className="block text-sm font-medium text-gray-700">
              Abstrak
            </label>
            <div className="mt-1">
              <textarea
                id="abstrak"
                name="abstrak"
                rows={5}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., lorem ipsum"
              ></textarea>
            </div>
          </div>

          {/* Hasil */}
          <FileUploadGroup
            label="Hasil"
            id="hasil_foto"
            placeholder="Pilih Foto Hasil"
          />

          {/* Proposal */}
          <FileUploadGroup
            label="Proposal"
            id="proposal_file"
            placeholder="Pilih File Proposal"
          />

          {/* Tombol Aksi */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}