"use client"; // Diperlukan untuk state, effect, dan portal

import { X } from 'react-feather';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
// Import tipe data ProjectData
import { type ProjectData } from '@/app/admin/dashboard/capstone-projects/all-projects/page'; 

// Tipe untuk Props
interface ProjectCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData; // Data proyek yang akan ditampilkan
}

// Sub-komponen untuk setiap bagian di modal
const ModalSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="text-base font-semibold text-gray-800">{title}</h4>
    <div className="mt-2 text-sm text-gray-700">
      {children}
    </div>
  </div>
);

export default function ProjectCardModal({ isOpen, onClose, project }: ProjectCardModalProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isOpen || !isClient) return null;

  return createPortal(
    // Overlay
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      {/* Konten Modal */}
      <div
        className="relative flex h-full max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex-shrink-0 border-b p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Project Card</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body Modal (Bisa di-scroll) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            
            <ModalSection title="Judul">
              <p className="font-medium text-gray-900">{project.judul}</p>
            </ModalSection>

            <ModalSection title="Anggota Tim">
              <ul className="list-disc space-y-1 pl-5">
                {project.anggota.map((anggota, index) => (
                  <li key={index}>{anggota}</li>
                ))}
              </ul>
            </ModalSection>

            <ModalSection title="Dosen Pembimbing">
              <p>{project.dosenPembimbing}</p>
            </ModalSection>

            <ModalSection title="Dokumen">
              <a 
                href={project.dokumen.startsWith('http') ? project.dokumen : `//${project.dokumen}`} // Memastikan link valid
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {project.dokumen}
              </a>
            </ModalSection>

            <ModalSection title="Abstrak">
              <p className="whitespace-pre-line leading-relaxed">{project.abstrak}</p>
            </ModalSection>
            
            <ModalSection title="Kata Kunci">
              <p className="italic text-gray-600">{project.kataKunci}</p>
            </ModalSection>

            <ModalSection title="Hasil">
              <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {project.hasilGambar.map((src, index) => (
                  <div key={index} className="overflow-hidden rounded-lg border">
                    {/* Ganti <img> dengan <Image> dari next/image di aplikasi nyata */}
                    <img 
                      src={src} 
                      alt={`Hasil Project ${index + 1}`}
                      className="h-32 w-full object-cover" 
                      // Di aplikasi nyata, gunakan placeholder jika src tidak ada
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                    />
                  </div>
                ))}
              </div>
            </ModalSection>

          </div>
        </div>
      </div>
    </div>,
    document.body // Target Portal
  );
}