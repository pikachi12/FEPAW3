"use client"; // Diperlukan untuk state, effect, dan portal

import { X } from 'react-feather';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
// Import tipe data TeamData
import { type TeamData } from '@/lib/dummy-data'; 
import Link from 'next/link';

// Tipe untuk Props
interface TeamCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamData; // Data tim yang akan ditampilkan
}

export default function TeamCardModal({ isOpen, onClose, team }: TeamCardModalProps) {
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
        className="relative flex h-full max-h-[90vh] w-full max-w-xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
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

        {/* Body Modal (Bisa di-scroll) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            
            {/* Detail Tim */}
            <div>
              <h4 className="mb-2 text-base font-semibold text-gray-800">Detail Tim</h4>
              <div className="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-3 text-sm">
                <span className="font-medium text-gray-700">Tema</span>
                <span className="text-gray-900">{team.tema}</span>

                <span className="font-medium text-gray-700">Role</span>
                <span className="text-gray-900">{team.roleKetua}</span>
                
                <span className="font-medium text-gray-700">Judul Project</span>
                <span className="text-gray-900">{team.judulProject || '-'}</span> {/* Bisa kosong */}

                <span className="font-medium text-gray-700">Nama Tim</span>
                <span className="text-gray-900">{team.namaTim}</span>
                
                <span className="font-medium text-gray-700">Tahun</span>
                <span className="text-gray-900">{team.tahun}</span>
              </div>
            </div>

            {/* Nama Ketua Tim */}
            <div>
              <h4 className="mb-2 text-base font-semibold text-gray-800">Nama Ketua Tim</h4>
              <p className="text-sm text-gray-900">{team.namaKetua} ({team.nimNipKetua})</p>
              <p className="text-sm text-gray-600">{team.emailKetua}</p>
            </div>

            {/* Nama Anggota Tim */}
            <div>
              <h4 className="mb-2 text-base font-semibold text-gray-800">Nama Anggota Tim</h4>
              <ul className="list-decimal space-y-1 pl-5 text-sm text-gray-900">
                {team.anggota.map((anggota, index) => (
                  <li key={index}>{anggota.nama} ({anggota.nimNip}), {anggota.programStudi}</li>
                ))}
              </ul>
            </div>

            {/* Dosen Pembimbing */}
            <div>
              <h4 className="mb-2 text-base font-semibold text-gray-800">Dosen Pembimbing</h4>
              <p className="text-sm text-gray-900">{team.dosenPembimbing.nama}, {team.dosenPembimbing.gelar}</p>
              <p className="text-sm text-gray-600">{team.dosenPembimbing.email}</p>
            </div>

            {/* Pengalaman Tim */}
            <div>
              <h4 className="mb-2 text-base font-semibold text-gray-800">Pengalaman Tim</h4>
              <p className="text-sm text-gray-900">{team.pengalamanTim || '-'}</p>
            </div>

          </div>
        </div>

        {/* Footer Modal (Tombol Aksi) */}
        <div className="flex-shrink-0 flex justify-end gap-3 border-t p-6">
          <button
            className="rounded-lg border border-red-600 bg-white px-5 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
          >
            Delete
          </button>
          <Link href={`/admin/dashboard/capstone-teams/edit-team/${team.id}`}>
          <button
            className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
          >
            Edit
          </button></Link>
          
        </div>
      </div>
    </div>,
    document.body
  );
}