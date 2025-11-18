"use client";

import { X } from 'react-feather';
import toast from "react-hot-toast";
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
  // Removed duplicate useState declaration
  isOpen,
  onClose,
  project,
}: ProjectCardModalProps) {
  const [isClient, setIsClient] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState<boolean>(false);

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
      toast.error(err.message || "Gagal menghapus capstone.");
      return;
    }

    toast.success("Capstone berhasil dihapus");
    onClose(); // tutup modal
    window.location.reload(); // reload halaman agar row hilang
  } catch (error: any) {
    toast.error(error.message || "Terjadi kesalahan saat delete.");
    console.error("Delete error:", error);
  }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <p className="mb-2 text-sm text-gray-500">{project.kategori}</p>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">{project.judul}</h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="mb-2 font-semibold text-gray-800">Nama Anggota Tim</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              {project.anggota?.length > 0 ? project.anggota.map((anggota, index) => (
                <li key={anggota.id || index}>{anggota.name}</li>
              )) : <li className="text-gray-500">Tidak ada anggota.</li>}
            </ul>

            <h3 className="mt-6 mb-2 font-semibold text-gray-800">Dosen Pembimbing</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              {project.dosen ? <li>{project.dosen.name || project.dosen.nama || project.dosen.email}</li> : <li className="text-gray-500">Tidak ada data dosen.</li>}
            </ul>
          </div>

          {/* Kolom Kanan: Abstrak, Hasil, Proposal, dll. */}
          <div className="md:col-span-2">
            <h3 className="mb-2 font-semibold text-gray-800">Abstrak</h3>
            <p className="mb-4 text-sm text-gray-600">
              {showFullAbstract || !project.abstrak || project.abstrak.length <= 300
                ? project.abstrak || "Tidak ada abstrak."
                : project.abstrak.slice(0, 300) + "..."}
              {project.abstrak && project.abstrak.length > 300 && (
                <button
                  type="button"
                  className="ml-2 text-xs text-blue-600 underline hover:text-blue-800"
                  onClick={() => setShowFullAbstract((v: boolean) => !v)}
                >
                  {showFullAbstract ? "Tutup" : "Lihat Selengkapnya"}
                </button>
              )}
            </p>

            <h3 className="mb-2 font-semibold text-gray-800">Hasil</h3>
            {project.hasil && project.hasil.length > 0 ? (
              <div className="mb-4 flex flex-wrap gap-4">
                {project.hasil.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Hasil ${index + 1}`}
                    className="h-24 w-24 rounded border object-cover"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">Belum ada hasil yang tersedia.</p>
            )}

            <h3 className="mb-2 font-semibold text-gray-800">Proposal</h3>
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
          </div>
        </div>

        {/* FOOTER: Edit & Delete Buttons */}
        <div className="flex justify-end gap-3 pt-8">
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
