"use client";
import { X, User, Hash, Grid, Calendar, Users, Link } from "react-feather";
import React, { useEffect, useState } from "react";

interface GroupData {
  tema?: string;
  namaTim?: string;
  tahun?: number;
  ketua: { name: string; nim: string };    
  anggota?: Array<{ name: string; nim: string }>;
  dosen: {name: string; nip: string };
  linkCVGabungan?: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: () => void;
  onAdd: () => void;
}

export default function ProfileModal({ isOpen, onClose, onReport, onAdd }: ProfileModalProps) {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchGroupData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/my-group`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

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

          {/* Section Title */}
          <p className="text-base font-semibold text-gray-800 mb-3">Detail Tim</p>

          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {groupData && (
            <div className="space-y-3 text-sm">
              {/* ITEM */}
              <div className="flex gap-3">
              <Hash size={18} className="text-gray-700" />
              <span className="w-32 text-gray-500">Tema</span>
              <span className="text-gray-800">{groupData.tema || "-"}</span>
              </div>

              <div className="flex gap-3">
              <Grid size={18} className="text-gray-700" />
              <span className="w-32 text-gray-500">Nama Tim</span>
              <span className="text-gray-800">{groupData.namaTim || "-"}</span>
              </div>

              <div className="flex gap-3">
              <Calendar size={18} className="text-gray-700" />
              <span className="w-32 text-gray-500">Tahun</span>
              <span className="text-gray-800">{groupData.tahun || "-"}</span>
              </div>

              <div className="flex gap-3 items-start">
              <User size={18} className="text-gray-700" />
              <span className="w-32 text-gray-500">Nama Ketua</span>
              <span className="text-gray-800 leading-relaxed">
                {(groupData.ketua?.name && groupData.ketua.name.trim() !== "" ? groupData.ketua.name : "-")} ({(groupData.ketua?.nim && groupData.ketua.nim.trim() !== "" ? groupData.ketua.nim : "-")})
              </span>
              </div>

              <div className="flex gap-3 items-start">
              <Users size={18} className="text-gray-700" />
              <span className="w-32 text-gray-500">Nama Anggota</span>
              <div className="text-gray-800 leading-relaxed space-y-1">
                {groupData.anggota && groupData.anggota.length > 0 ? (
                groupData.anggota.map((member, idx) => (
                  <p key={idx}>{idx + 1}. {member.name} ({member.nim})</p>
                ))
                ) : (
                <p>-</p>
                )}
              </div>
              </div>

              <div className="flex gap-3 items-start">
              <User size={18} className="text-gray-700" />
              <span className="w-32 text-gray-500">Dosen Pembimbing</span>
              <span className="text-gray-800 leading-relaxed">
                {(groupData.dosen?.name && groupData.dosen.name.trim() !== "" ? groupData.dosen.name : "-")} ({(groupData.dosen?.nip && groupData.dosen.nip.trim() !== "" ? groupData.dosen.nip : "-")})
              </span>
              </div>

              <div className="flex gap-3 items-start">
              <Link size={18} className="text-gray-700" />
              <span className="w-32 text-gray-500">Pengalaman Tim</span>
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
                  className="text-blue-600 hover:underline break-words"
                >
                  {groupData.linkCVGabungan}
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
            <button onClick={onAdd} className="px-4 py-2 text-sm border rounded-md text-gray-700 hover:bg-gray-100">
              Add Pengalaman Tim
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
