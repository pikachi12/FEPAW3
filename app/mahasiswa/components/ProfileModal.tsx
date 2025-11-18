"use client";
import { X, User, Hash, Grid, Calendar, Users, Link } from "react-feather";
import React, { useEffect, useState } from "react";

interface GroupData {
  tema?: string;
  namaTim?: string;
  tahun?: number;
  ketua: { name: string; nim: string };
  anggota?: Array<{ name: string; nim: string }>;
  dosen: { name: string; nip: string };
  linkCVGabungan?: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: () => void;
  onAdd: () => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  onReport,
  onAdd,
}: ProfileModalProps) {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchGroupData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/groups/my-group`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch group data");
        }

        const data = await res.json();
        setGroupData(data);
      } catch (err) {
        console.error("Error fetching group data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 px-4
        transition-opacity duration-200
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      {/* BACKDROP – Fade duluan */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-200
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* MODAL BOX – Animasi scale + fade menyusul */}
      <div
        className={`bg-white rounded-xl w-full max-w-2xl shadow-lg relative p-6
          transition-all duration-300 ease-out
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">User Profile</h2>

        {/* Content Box */}
        <div className="rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-semibold text-gray-800">Detail Tim</p>
            {loading && <span className="text-gray-500 text-sm">Loading...</span>}
          </div>

          {error && <p className="text-red-500">Error: {error}</p>}

          {groupData && (
            <div className="space-y-3 text-sm">
              {/* Tema */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="flex items-center gap-2 mb-1 sm:mb-0">
                  <Hash size={18} className="text-gray-700" />
                  <span className="text-gray-500">Tema</span>
                </div>
                <span className="text-gray-800">{groupData.tema || "-"}</span>
              </div>

              {/* Nama Tim */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="flex items-center gap-2 mb-1 sm:mb-0">
                  <Grid size={18} className="text-gray-700" />
                  <span className="text-gray-500">Nama Tim</span>
                </div>
                <span className="text-gray-800">{groupData.namaTim || "-"}</span>
              </div>

              {/* Tahun */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="flex items-center gap-2 mb-1 sm:mb-0">
                  <Calendar size={18} className="text-gray-700" />
                  <span className="text-gray-500">Tahun</span>
                </div>
                <span className="text-gray-800">{groupData.tahun || "-"}</span>
              </div>

              {/* Ketua */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="flex items-center gap-2 mb-1 sm:mb-0">
                  <User size={18} className="text-gray-700" />
                  <span className="text-gray-500">Nama Ketua</span>
                </div>
                <span className="text-gray-800">
                  {groupData.ketua?.name || "-"}{" "}
                  <span className="hidden md:inline text-gray-500">
                    ({groupData.ketua?.nim || "-"})
                  </span>
                </span>
              </div>

              {/* Anggota */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="flex items-center gap-2 mb-1 sm:mb-0">
                  <Users size={18} className="text-gray-700" />
                  <span className="text-gray-500">Nama Anggota</span>
                </div>
                <div className="text-gray-800 space-y-1">
                  {groupData.anggota?.length ? (
                    groupData.anggota.map((m, i) => (
                      <p key={i}>
                        {m.name}{" "}
                        <span className="hidden md:inline text-gray-500">
                          ({m.nim})
                        </span>
                      </p>
                    ))
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>

              {/* Dosen*/}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="flex items-center gap-2 mb-1 sm:mb-0">
                  <User size={18} className="text-gray-700" />
                  <span className="text-gray-500">Dosen Pembimbing</span>
                </div>
                <span className="text-gray-800">
                  {groupData.dosen?.name || "-"}{" "}
                  <span className="hidden md:inline text-gray-500">
                    ({groupData.dosen?.nip || "-"})
                  </span>
                </span>
              </div>

              {/* CV */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="flex items-center gap-2 mb-1 sm:mb-0">
                  <Link size={18} className="text-gray-700" />
                  <span className="text-gray-500">Pengalaman Tim</span>
                </div>
                <span className="text-gray-800">
                  {groupData.linkCVGabungan ? (
                    <a
                      href={
                        groupData.linkCVGabungan.startsWith("http")
                          ? groupData.linkCVGabungan
                          : `https://${groupData.linkCVGabungan}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Lihat berkas
                    </a>
                  ) : (
                    "-"
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onAdd}
              className="px-4 py-2 text-sm border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50"
            >
              Add CV
            </button>

            <button
              onClick={onReport}
              className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Report Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
