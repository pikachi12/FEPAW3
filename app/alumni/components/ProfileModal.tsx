"use client";
import { X, User, Bell, LogOut } from "react-feather";
import React from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: () => void;
  onAdd:() => void;
}

export default function ProfileModal({ isOpen, onClose, onReport, onAdd}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-[650px] rounded-xl w-full max-w-2xl shadow-lg relative p-6">

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

          <div className="space-y-3 text-sm">
            {/* ITEM */}
            <div className="flex gap-3">
              <span className="w-32 text-gray-500">📌 Nama Tim</span>
              <span className="text-gray-800">Pengolahan Sampah</span>
            </div>

            <div className="flex gap-3">
              <span className="w-32 text-gray-500">🏷 Batch</span>
              <span className="text-gray-800">FoE 2023</span>
            </div>

            <div className="flex gap-3">
              <span className="w-32 text-gray-500">📅 Tahun</span>
              <span className="text-gray-800">2023</span>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-32 text-gray-500">👤 Nama Ketua</span>
              <span className="text-gray-800 leading-relaxed">
                Raka Aditya Putra (22/531752/SV/1234, Teknologi Informasi)
              </span>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-32 text-gray-500">👥 Nama Anggota</span>
              <div className="text-gray-800 leading-relaxed space-y-1">
                <p>1. Siti Nurlailah (22/987654/SV/9876, Teknik Elektro)</p>
                <p>2. Rezha Prabowo (22/123456/SV/2222, Teknik Elektro)</p>
                <p>3. Iqbal Fadhilah (22/987321/SV/1122, Sistem Informasi)</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-32 text-gray-500">🧑‍🏫 Dosen Pembimbing</span>
              <span className="text-gray-800 leading-relaxed">
                Dr. Rudi Santoso, S.T., M.Eng (197911112001)
              </span>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-32 text-gray-500">📝 Pengalaman Tim</span>
              <span className="text-gray-800">-</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={onAdd} className="px-4 py-2 text-sm border rounded-md text-gray-700 hover:bg-gray-100">
              Add Pengalaman Tim
            </button>

            <button 
            onClick={onReport}
            className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700">
              Report Data
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
