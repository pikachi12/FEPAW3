"use client";

import { X } from "react-feather";
import toast from "react-hot-toast";
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
        toast.error(data.message || "Gagal menghapus tim");
        setDeleting(false);
        return;
      }

      toast.success("Team berhasil dihapus!");
      setDeleting(false);
      onClose(); // Tutup modal
      window.location.reload(); // Refresh data

    } catch (err) {
      console.error("Delete Team Error:", err);
      toast.error("Terjadi kesalahan");
      setDeleting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg relative p-6" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Card</h2>

        {/* Content Box */}
        <div className="rounded-xl p-5">
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <span className="font-medium w-32 text-gray-500">Tema</span>
              <span className="text-gray-800">{team.tema || "-"}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <span className="font-medium w-32 text-gray-500">Nama Tim</span>
              <span className="text-gray-800">{team.namaTim || "-"}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <span className="font-medium w-32 text-gray-500">Tahun</span>
              <span className="text-gray-800">{team.tahun || "-"}</span>
            </div>

            <div className="flex gap-3 items-start">
              <span className="font-medium w-32 text-gray-500">Nama Ketua</span>
              <span className="text-gray-800 leading-relaxed">
                {(team.ketua?.name && team.ketua.name.trim() !== "" ? team.ketua.name : "-")} <span className="text-gray-500">(</span><span className="text-gray-500">{(team.ketua?.nim && team.ketua.nim.trim() !== "" ? team.ketua.nim : "-")}</span><span className="text-gray-500">)</span>
              </span>
            </div>

            <div className="flex gap-3 items-start">
              <span className="font-medium w-32 text-gray-500">Nama Anggota</span>
              <div className="text-gray-800 leading-relaxed space-y-1">
                {team.anggota && team.anggota.length > 0 ? (
                  team.anggota.map((member, idx) => (
                    <p key={idx}>{member.name} <span className="text-gray-500">(</span><span className="text-gray-500">{member.nim}</span><span className="text-gray-500">)</span></p>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="font-medium w-32 text-gray-500">Dosen Pembimbing</span>
              <span className="text-gray-800 leading-relaxed">
                {(team.dosen?.name && team.dosen.name.trim() !== "" ? team.dosen.name : "-")} <span className="text-gray-500">(</span><span className="text-gray-500">{('nip' in team.dosen && typeof team.dosen.nip === 'string' && team.dosen.nip.trim() !== "" ? team.dosen.nip : "-")}</span><span className="text-gray-500">)</span>
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`px-4 py-2 text-sm border border-red-600 text-red-600 rounded-md hover:bg-red-50 ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>

            <Link href={`/admin/dashboard/capstone-teams/edit-team/${team.id}`}>
              <button className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700">
                Edit
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
