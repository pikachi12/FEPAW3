"use client";

import { X, Hash, Mail, User, List, Smile } from "react-feather";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { type PersonData } from "@/app/admin/dashboard/data-person/all-mahasiswa/page";

interface PersonCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: PersonData;
}

export default function PersonCardModal({
  isOpen,
  onClose,
  person,
}: PersonCardModalProps) {
  const [isClient, setIsClient] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isOpen || !isClient) return null;

  // 🔥 DELETE USER — sama seperti TeamCardModal, cuma endpoint berbeda
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    setDeleting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${person.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal menghapus user");
        setDeleting(false);
        return;
      }

      alert("User berhasil dihapus!");
      setDeleting(false);
      onClose(); // Tutup modal
      window.location.reload(); // Refresh data

    } catch (err) {
      console.error("Delete User Error:", err);
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
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-900">Person Card</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6">
          <h4 className="mb-4 text-base font-semibold text-gray-800">
            Detail Person
          </h4>

          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">NIM/NIP</span>
            </div>
            <span className="text-sm text-gray-900">{person.nim}</span>

            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Email</span>
            </div>
            <span className="text-sm text-gray-900">{person.email}</span>

            <div className="flex items-center gap-2 text-gray-700">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Nama</span>
            </div>
            <span className="text-sm text-gray-900">{person.name}</span>

            <div className="flex items-center gap-2 text-gray-700">
              <List className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Program Studi</span>
            </div>
            <span className="text-sm text-gray-900">{person.prodi}</span>

            <div className="flex items-center gap-2 text-gray-700">
              <Smile className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Role</span>
            </div>
            <span className="text-sm text-gray-900 capitalize">{person.role}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`rounded-lg border border-red-600 px-5 py-2 text-sm font-semibold text-red-600 shadow-sm 
              hover:bg-red-50 ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

          <Link href={`/admin/dashboard/data-person/edit-data/${person.id}`}>
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
