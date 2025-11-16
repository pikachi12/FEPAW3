"use client"; // Diperlukan untuk state, effect, dan portal

import { X, Hash, Mail, User, List, Smile, type Icon as FeatherIcon } from 'react-feather';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // 1. Import createPortal
import { type PersonData } from '@/app/admin/dashboard/data-person/all-mahasiswa/page'; 

// Tipe untuk Props
interface PersonCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: PersonData;
}

export default function PersonCardModal({ isOpen, onClose, person }: PersonCardModalProps) {
  // ----------------------------------------------------------------
  // AWAL DARI PERBAIKAN 1: PORTAL
  // Ini untuk memastikan portal hanya berjalan di client-side
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  // ----------------------------------------------------------------

  // Jangan render jika !isOpen atau jika ini masih di server (isClient false)
  if (!isOpen || !isClient) return null;

  // ----------------------------------------------------------------
  // AKHIR DARI PERBAIKAN 1: PORTAL
  // Kita bungkus semuanya dengan 'createPortal'
  // Targetnya adalah 'document.body'
  return createPortal(
    
    // 1. Overlay (Latar belakang gelap)
    // 'flex items-center justify-center' sekarang akan bekerja di layar penuh
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose} // Menutup modal jika klik di luar
    >
      {/* 2. Konten Modal */}
      <div
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat klik di dalam
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-900">Person Card</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =======================================================
          PERBAIKAN 2: GANTI LAYOUT BODY DENGAN CSS GRID
          =======================================================
        */}
        <div className="py-6">
          <h4 className="mb-4 text-base font-semibold text-gray-800">Detail Person</h4>
          
          {/* 'grid-cols-[auto_1fr]' 
            - Kolom 1 ('auto'): Lebar otomatis sesuai konten (label+ikon)
            - Kolom 2 ('1fr'): Mengisi sisa ruang
            'gap-x-4' (jarak horizontal), 'gap-y-3' (jarak vertikal)
          */}
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
            
            {/* Baris 1: NIM/NIP */}
            <div className="flex items-center gap-2 text-gray-700">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">NIM/NIP</span>
            </div>
            <span className="text-sm text-gray-900">{person.nimNip}</span>
            
            {/* Baris 2: Email */}
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Email</span>
            </div>
            <span className="text-sm text-gray-900">{person.email}</span>

            {/* Baris 3: Nama */}
            <div className="flex items-center gap-2 text-gray-700">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Nama</span>
            </div>
            <span className="text-sm text-gray-900">{person.nama}</span>

            {/* Baris 4: Program Studi */}
            <div className="flex items-center gap-2 text-gray-700">
              <List className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Program Studi</span>
            </div>
            <span className="text-sm text-gray-900">{person.programStudi}</span>

            {/* Baris 5: Role */}
            <div className="flex items-center gap-2 text-gray-700">
              <Smile className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Role</span>
            </div>
            <span className="text-sm text-gray-900">{person.role}</span>
          </div>
        </div>
        {/* =======================================================
            AKHIR DARI PERBAIKAN 2
          ======================================================= 
        */}

        {/* Footer Modal (Tombol Aksi) */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            className="rounded-lg border border-red-600 bg-white px-5 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
          >
            Delete
          </button>
          <button
            className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
          >
            Edit
          </button>
        </div>
      </div>
    </div>,
    document.body // Target Portal adalah 'document.body'
  );
}