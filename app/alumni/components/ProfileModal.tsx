"use client";
import { X, User, Hash, Grid, Calendar, Users, Link } from "react-feather";
import React, { useEffect, useState } from "react";


interface CapstoneData {
  tema?: string;
  namaTim?: string;
  tahun?: number;
  ketua: { name: string; nim: string };
  anggota?: Array<{ name: string; nim: string }>;
  dosen: { name: string; nip: string };
  proposalUrl?: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: () => void;
  onAdd: () => void;
}

export default function ProfileModal(props: ProfileModalProps) {
  const { isOpen, onClose, onReport, onAdd } = props;
  const [capstoneData, setCapstoneData] = useState<CapstoneData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCapstoneData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/capstones/my-capstone`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });


        if (!res.ok) {
          if (res.status === 404) {
            setCapstoneData(null);
            setError(null);
            return;
          }
          throw new Error("Failed to fetch capstone data");
        }

        const data = await res.json();

        // Check if data is empty or null
        if (!data || Object.keys(data).length === 0) {
          setCapstoneData(null);
          return;
        }
        // Only keep the required fields
        const filtered: CapstoneData = {
          tema: data.kategori, // kategori -> tema
          namaTim: data.judul, // judul -> namaTim
          tahun: data.tahun,
          ketua: data.ketua,
          anggota: data.anggota,
          dosen: data.dosen,
          proposalUrl: data.proposalUrl,
        };
        setCapstoneData(filtered);
      } catch (err) {
        console.error("Error fetching capstone data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    

    fetchCapstoneData();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg relative p-6">

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

          {/* Section Title and Loading */}
          <div className="flex items-center justify-between mb-3">
            {capstoneData ? (
              <p className="text-base font-semibold text-gray-800">Detail Tim</p>
            ) : (
              <div className="w-full flex justify-center">
                <span className="text-base text-gray-400 text-center">Tidak ada capstone</span>
              </div>
            )}
            {loading && <span className="text-gray-500 text-sm">Loading...</span>}
          </div>
          {error && <p className="text-red-500">Error: {error}</p>}

          {capstoneData && (
            <div className="space-y-3 text-sm">

              {/* Judul */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Grid size={18} className="text-gray-700" />
                  <span className="sm:w-32 text-gray-500">Judul</span>
                </div>
                <span className="text-gray-800">{capstoneData.namaTim || "-"}</span>
              </div>

              {/* Kategori */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Hash size={18} className="text-gray-700" />
                  <span className="sm:w-32 text-gray-500">Kategori</span>
                </div>
                <span className="text-gray-800">{capstoneData.tema || "-"}</span>
              </div>

              {/* Tahun */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-700" />
                  <span className="sm:w-32 text-gray-500">Tahun</span>
                </div>
                <span className="text-gray-800">{capstoneData.tahun || "-"}</span>
              </div>

              {/* Nama Ketua */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-gray-700" />
                  <span className="sm:w-32 text-gray-500">Nama Ketua</span>
                </div>
                <span className="text-gray-800 leading-relaxed">
                  {(capstoneData.ketua?.name && capstoneData.ketua.name.trim() !== "" ? capstoneData.ketua.name : "-")}
                  <span className="hidden sm:inline text-gray-500"> ({(capstoneData.ketua?.nim && capstoneData.ketua.nim.trim() !== "" ? capstoneData.ketua.nim : "-")})</span>
                </span>
              </div>

              {/* Nama Anggota */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-gray-700" />
                  <span className="sm:w-32 text-gray-500">Nama Anggota</span>
                </div>
                <div className="text-gray-800 leading-relaxed space-y-1">
                  {capstoneData.anggota && capstoneData.anggota.length > 0 ? (
                      capstoneData.anggota.map((member) => (
                        <p key={member.nim}>{member.name}<span className="hidden sm:inline text-gray-500"> ({member.nim})</span></p>
                    ))
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>

              {/* Dosen Pembimbing */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-gray-700" />
                  <span className="sm:w-32 text-gray-500">Dosen Pembimbing</span>
                </div>
                <span className="text-gray-800 leading-relaxed">
                  {(capstoneData.dosen?.name && capstoneData.dosen.name.trim() !== "" ? capstoneData.dosen.name : "-")}
                  <span className="hidden sm:inline text-gray-500"> ({(capstoneData.dosen?.nip && capstoneData.dosen.nip.trim() !== "" ? capstoneData.dosen.nip : "-")})</span>
                </span>
              </div>

              {/* Proposal Link */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start">
                <div className="flex items-center gap-2">
                  <Link size={18} className="text-gray-700" />
                  <span className="sm:w-32 text-gray-500">Proposal</span>
                </div>
                <span className="text-gray-800">
                  {capstoneData.proposalUrl ? (
                    <a
                      href={capstoneData.proposalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-words"
                    >
                      Lihat Proposal
                    </a>
                  ) : (
                    "-"
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
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
