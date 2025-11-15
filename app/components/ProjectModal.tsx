// components/ProjectModal.jsx

import React from 'react';
import { X } from 'react-feather';
import { Project } from '@/app/page'; 

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  // Menentukan status ketersediaan
  const isAvailable = project.status === 'Available';
  
  // Menentukan alasan tidak tersedia
  let notAvailableReason = '';
  if (project.status === 'NotAvailable_Taken') {
    notAvailableReason = `(diambil oleh tim ${project.takenBy})`;
  } else if (project.status === 'NotAvailable_Limit') {
    notAvailableReason = '(telah mendapatkan 3 request dalam 1 waktu)';
  }

  return (
    // Backdrop overlay
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat klik di dalam modal
      >
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          {/* <-- DIUBAH: Menggunakan komponen ikon X --> */}
          <X className="h-6 w-6" /> 
        </button>

        {/* Header */}
        <p className="mb-2 text-sm text-gray-500">{project.category}</p>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">{project.title}</h2>

        {/* Status Section */}
        <div className="mb-4 flex items-center">
          {isAvailable ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Available
            </span>
          ) : (
            <>
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                Not Available
              </span>
              <span className="ml-2 text-sm text-red-600">
                {notAvailableReason}
              </span>
            </>
          )}
        </div>

        {/* Kolom Kiri: Detail Tim & Dosen */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="mb-2 font-semibold text-gray-800">Nama Anggota Tim</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              {project.teamMembers.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>

            <h3 className="mt-6 mb-2 font-semibold text-gray-800">Dosen Pembimbing</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              {project.supervisors.map((supervisor, index) => (
                <li key={index}>{supervisor}</li>
              ))}
            </ul>
          </div>

          {/* Kolom Kanan: Abstrak, Hasil, dll. */}
          <div className="md:col-span-2">
            <h3 className="mb-2 font-semibold text-gray-800">Abstrak</h3>
            <p className="mb-4 text-sm text-gray-600">{project.abstract}</p>

            <h3 className="mb-2 font-semibold text-gray-800">Kata Kunci</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.keywords.map((keyword, index) => (
                <span key={index} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                  {keyword}
                </span>
              ))}
            </div>

            <h3 className="mb-2 font-semibold text-gray-800">Hasil</h3>
            <div className="mb-4 flex gap-4">
              {/* Ganti dengan komponen Image dari Next.js jika perlu */}
              <img src="/image-placeholder-1.jpg" alt="Hasil 1" className="h-24 w-24 rounded border object-cover" />
              <img src="/image-placeholder-2.jpg" alt="Hasil 2" className="h-24 w-24 rounded border object-cover" />
            </div>

            <h3 className="mb-2 font-semibold text-gray-800">Alasan Pengajuan</h3>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              rows={3}
              placeholder="Ketik di sini (max 100 kata)"
              disabled={!isAvailable} // Textarea juga di-disable jika not available
            ></textarea>
            
            <div className="mt-6 flex justify-end">
              <button
                className={`rounded-lg px-6 py-2 text-white font-medium
                  ${isAvailable 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                disabled={!isAvailable} // Tombol dinonaktifkan jika status tidak 'Available'
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}