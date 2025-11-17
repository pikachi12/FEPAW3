"use client";

import { X } from "react-feather";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { type GroupData } from "@/app/admin/dashboard/capstone-teams/all-teams/page";

interface TeamCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: GroupData;
}

export default function TeamCardModal({ isOpen, onClose, team }: TeamCardModalProps) {
  const [isClient, setIsClient] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isOpen || !isClient) return null;

  // 🔥 HANDLE DELETE TEAM
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus tim ini?")) return;

    setDeleting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/groups/${team.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal menghapus tim");
        setDeleting(false);
        return;
      }

      alert("Team berhasil dihapus!");
      setDeleting(false);
      onClose(); // Tutup modal
      window.location.reload(); // Refresh data

    } catch (err) {
      console.error("Delete Team Error:", err);
      alert("Terjadi kesalahan");
      setDeleting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[90vh] w-full max-w-xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Team Card</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <div>
              <h4 className="mb-2 text-base font-semibold text-gray-800">Detail Tim</h4>
              <div className="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-3 text-sm">
                <span className="font-medium">Tema</span>
                <span>{team.tema}</span>
                <span className="font-medium">Nama Tim</span>
                <span>{team.namaTim}</span>
                <span className="font-medium">Tahun</span>
                <span>{team.tahun}</span>
              </div>
            </div>

            {/* Ketua */}
            <div>
              <h4 className="mb-2 text-base font-semibold text-gray-800">Ketua Tim</h4>
              <p className="text-sm">{team.ketua.name} ({team.ketua.nim})</p>
              <p className="text-sm text-gray-600">{team.ketua.email}</p>
            </div>

            {/* Anggota */}
            <div>
              <h4 className="mb-2 text-base font-semibold text-gray-800">Anggota Tim</h4>
              <ul className="list-disc pl-5 text-sm">
                {team.anggota.map((m, i) => (
                  <li key={i}>{m.name} ({m.nim})</li>
                ))}
              </ul>
            </div>

            {/* Dosen */}
            <div>
              <h4 className="mb-2 text-base font-semibold">Dosen Pembimbing</h4>
              <p className="text-sm">{team.dosen.name}</p>
              <p className="text-sm text-gray-600">{team.dosen.email}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t p-6">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`rounded-lg border border-red-600 px-5 py-2 text-sm font-semibold text-red-600 shadow-sm 
              hover:bg-red-50 ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

          <Link href={`/admin/dashboard/capstone-teams/edit-team/${team.id}`}>
            <button className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700">
              Edit
            </button>
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
