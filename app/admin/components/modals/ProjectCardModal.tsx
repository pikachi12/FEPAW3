"use client";

import { X } from 'react-feather';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { type ProjectData } from '@/app/admin/dashboard/capstone-projects/all-projects/page';

interface ProjectCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
}

const ModalSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h4 className="text-base font-semibold text-gray-800">{title}</h4>
    <div className="mt-2 text-sm text-gray-700">{children}</div>
  </div>
);

export default function ProjectCardModal({
  isOpen,
  onClose,
  project,
}: ProjectCardModalProps) {
  const [isClient, setIsClient] = useState(false);

  const handleDelete = async () => {
  const confirmDelete = confirm("Yakin ingin menghapus capstone ini?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/capstones/${project.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal menghapus capstone.");
    }

      alert("Capstone berhasil dihapus");

      onClose(); // tutup modal

      // reload halaman agar row hilang
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan saat delete.");
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex-shrink-0 border-b p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Project Detail</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Judul */}
            <ModalSection title="Judul">
              <p className="font-medium text-gray-900">{project.judul}</p>
            </ModalSection>

            {/* Ketua */}
            <ModalSection title="Ketua Tim">
              <p>{project.ketua?.name || "Tidak ada data ketua"}</p>
            </ModalSection>

            {/* Anggota */}
            <ModalSection title="Anggota Tim">
              {project.anggota?.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5">
                  {project.anggota.map((anggota) => (
                    <li key={anggota.id}>
                      {anggota.name} — <span className="text-gray-600">{anggota.email}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Tidak ada anggota.</p>
              )}
            </ModalSection>

            {/* Dosen */}
            <ModalSection title="Dosen Pembimbing">
              <p>{project.dosen?.name || "Tidak ada data dosen"}</p>
            </ModalSection>

            {/* Dokumen */}
            <ModalSection title="Proposal">
              {project.proposalUrl ? (
                <a
                  href={project.proposalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Lihat Proposal
                </a>
              ) : (
                <p className="text-gray-500">Belum ada proposal.</p>
              )}
            </ModalSection>

            {/* Abstrak */}
            <ModalSection title="Abstrak">
              <p className="whitespace-pre-line leading-relaxed">
                {project.abstrak || "Tidak ada abstrak."}
              </p>
            </ModalSection>

            {/* Gambar Hasil */}
            <ModalSection title="Hasil Gambar">
            {(project.hasil?.length ?? 0) > 0 ? (
              <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {(project.hasil ?? []).map((src, index) => (
                  <div key={index} className="overflow-hidden rounded-lg border">
                    <img
                      src={src}
                      alt={`Hasil Project ${index + 1}`}
                      className="h-32 w-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = "https://via.placeholder.com/150")
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Belum ada hasil gambar.</p>
            )}
          </ModalSection>
          </div>
        </div>

       {/* FOOTER */}
        <div className="flex-shrink-0 flex justify-end gap-3 border-t p-6">
          <button
            onClick={handleDelete}
            className="rounded-lg border border-red-600 bg-white px-5 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
          >
            Delete
          </button>

          <Link
            href={`/admin/dashboard/capstone-projects/edit-project/${project.id}`}
            className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
