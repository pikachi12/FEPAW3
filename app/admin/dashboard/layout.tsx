import Sidebar from '@/app/admin/components/Sidebar'; // Impor Sidebar di sini
import React from 'react';

/**
 * Ini adalah layout untuk SEMUA halaman di dalam /dashboard/*
 * 'children' akan secara otomatis menjadi file 'page.tsx'
 * yang sedang aktif.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* 1. Sidebar (Fixed) 
          Ini akan muncul di SEMUA halaman dashboard
      */}
      <Sidebar />

      {/* 2. Konten Utama (Bisa di-scroll) */}
      {/* 'ml-64' (margin-left: 16rem) diletakkan di sini
           karena Sidebar (w-64) ada di layout ini.
      */}
      <main className="flex-1 p-8">
        
        {/* 'children' adalah tempat di mana 'page.tsx' Anda
            (misal: Halaman Add Data, Halaman All Mahasiswa)
            akan dirender oleh Next.js
        */}
        {children}
      </main>
    </div>
  );
}