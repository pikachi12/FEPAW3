"use client";

import { X, Hash, Grid, Calendar, User, Users } from "react-feather";
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
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center px-4
      transition-opacity duration-200
      ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
    `}
    onClick={onClose}
  >
        {/* BACKDROP */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm
            transition-opacity duration-200
            ${isOpen ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* MODAL BOX */}
        <div
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-xl
            transition-all duration-300 ease-out
            ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
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
              <span className="flex items-center gap-2 font-normal text-gray-500 mb-1 sm:mb-0">
                <Hash size={18} className="text-gray-500" />
                <span className="ml-1">Tema</span>
              </span>
              <span className="text-gray-800 font-normal">{team.tema || "-"}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <span className="flex items-center gap-2 font-normal text-gray-500 mb-1 sm:mb-0">
                <Grid size={18} className="text-gray-500" />
                <span className="ml-1">Nama Tim</span>
              </span>
              <span className="text-gray-800 font-normal">{team.namaTim || "-"}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <span className="flex items-center gap-2 font-normal text-gray-500 mb-1 sm:mb-0">
                <Calendar size={18} className="text-gray-500" />
                <span className="ml-1">Tahun</span>
              </span>
              <span className="text-gray-800 font-normal">{team.tahun || "-"}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <span className="flex items-center gap-2 font-normal text-gray-500 mb-1 sm:mb-0">
                <User size={18} className="text-gray-500" />
                <span className="ml-1">Nama Ketua</span>
              </span>
              <span className="text-gray-800 font-normal leading-relaxed">
                {(team.ketua?.name && team.ketua.name.trim() !== "" ? team.ketua.name : "-")}
                <span className="hidden md:inline text-gray-500"> (</span>
                <span className="hidden md:inline text-gray-500">{(team.ketua?.nim && team.ketua.nim.trim() !== "" ? team.ketua.nim : "-")}</span>
                <span className="hidden md:inline text-gray-500">)</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 sm:items-start"> 
              <span className="flex items-center gap-2 font-normal text-gray-500 mb-1 sm:mb-0">
                <Users size={18} className="text-gray-500" />
                <span className="ml-1">Nama Anggota</span>
              </span>
              <div className="text-gray-800 font-normal leading-relaxed space-y-1">
                {team.anggota && team.anggota.length > 0 ? (
                  team.anggota.map((member, idx) => (
                    <p key={idx}>
                      {member.name}
                      <span className="hidden md:inline text-gray-500"> (</span>
                      <span className="hidden md:inline text-gray-500">{member.nim}</span>
                      <span className="hidden md:inline text-gray-500">)</span>
                    </p>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <span className="flex items-center gap-2 font-normal text-gray-500 mb-1 sm:mb-0">
                <User size={18} className="text-gray-500" />
                <span className="ml-1">Dosen Pembimbing</span>
              </span>
              <span className="text-gray-800 font-normal leading-relaxed">
                {(team.dosen?.name && team.dosen.name.trim() !== "" ? team.dosen.name : "-")}
                <span className="hidden md:inline text-gray-500"> (</span>
                <span className="hidden md:inline text-gray-500">{('nip' in team.dosen && typeof team.dosen.nip === 'string' && team.dosen.nip.trim() !== "" ? team.dosen.nip : "-")}</span>
                <span className="hidden md:inline text-gray-500">)</span>
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
