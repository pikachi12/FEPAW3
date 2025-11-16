"use client";

import { useState } from "react";
import { User, Bell, LogOut } from "react-feather";
import Link from "next/link";
import ProfileModal from "./ProfileModal";
import ReportDataModal from "./ReportDataModal";
import AddModal from "./AddModal";
import AlumniNotificationModal from "./AlumniNotificationModal";
import type { AlumniRequest } from "../types/types";

// --- DATA DUMMY (Nanti ini didapat dari API) ---
const dummyRequests: AlumniRequest[] = [
  {
    id: "req1",
    date: "21/03/2025",
    daysRemaining: 3,
    teamName: "FO4 2025",
    ketua: { name: "Raka Aditua", details: "(22/5123/TK/543)" },
    anggota: [
      { name: "Tri Nurtanto", details: "(22/5123/TK/543)" },
      { name: "Dimar Fahlul", details: "(22/5123/TK/543)" },
      { name: "Intan Mariam", details: "(22/5123/TK/543)" },
    ],
    dosen: { name: "Dr. Budi Santoso, S.T., M.Eng.", details: "(Dosen)" },
    alasan:
      "Tim kami mengajukan proyek SmartWaste... Kami juga berencana menganalisis fungsionalitas sistem...",
    driveLink: "google.drive.com/...",
    status: "pending", // Status Awal
  },
  {
    id: "req2",
    date: "20/03/2025",
    daysRemaining: 2,
    teamName: "Kreatif 2025",
    ketua: { name: "Sarah Wijaya", details: "(22/5123/TK/543)" },
    anggota: [{ name: "Budi Doremi", details: "(22/5123/TK/543)" }],
    dosen: { name: "Dr. Budi Santoso, S.T., M.Eng.", details: "(Dosen)" },
    alasan: "Proyek kami berfokus pada pengembangan AI untuk edukasi...",
    driveLink: "google.drive.com/...",
    status: "approved", // Contoh yang sudah di-approve
  },
  {
    id: "req3",
    date: "19/03/2025",
    daysRemaining: 1,
    teamName: "TechTitans",
    ketua: { name: "Ahmad Jalal", details: "(22/5123/TK/543)" },
    anggota: [{ name: "Citra Lestari", details: "(22/5123/TK/543)" }],
    dosen: { name: "Dr. Budi Santoso, S.T., M.Eng.", details: "(Dosen)" },
    alasan: "Analisis data besar untuk infrastruktur kota.",
    driveLink: "google.drive.com/...",
    status: "declined", // Contoh yang sudah di-decline
  },
];
// --- END DATA DUMMY ---

export default function NavbarMahasiswa() {
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState<AlumniRequest[]>(dummyRequests);

  // Get user data from localStorage
  const getUserData = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  };

  // Fungsi ini akan dipanggil oleh tombol "Approved"
  const handleApproveRequest = (id: string) => {
    console.log("Approving request:", id);
    // TODO: Kirim data ke API di sini

    // Update state secara lokal untuk mengubah UI
    setRequests((currentRequests) =>
      currentRequests.map((req) =>
        req.id === id ? { ...req, status: "approved" } : req
      )
    );
  };

  // Fungsi ini akan dipanggil oleh tombol "Declined"
  const handleDeclineRequest = (id: string) => {
    console.log("Declining request:", id);
    // TODO: Kirim data ke API di sini

    // Update state secara lokal untuk mengubah UI
    setRequests((currentRequests) =>
      currentRequests.map((req) =>
        req.id === id ? { ...req, status: "declined" } : req
      )
    );
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 border-b bg-white sticky top-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="font-bold text-lg">CAPCON</div>
        <span className="text-sm text-gray-500">Capstone Container</span>
      </div>

      {/* Profile */}
      <div className="relative">
        {/* Trigger */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3"
        >
          {/* Avatar */}
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>

          {/* User info (dynamic) */}
          <div className="hidden sm:block text-left">
            <p className="font-semibold text-gray-800">{getUserData()?.name || "Alumni User"}</p>
            <p className="text-gray-500 text-sm">{getUserData()?.email || "alumni@mail.com"}</p>
          </div>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg border z-30">
            {/* TITLE SECTION */}
            <div className="px-4 py-3 border-b">
              <h2 className="text-sm font-semibold text-gray-800">
                More Action
              </h2>
              <p className="text-gray-400 text-xs">
                Click to your next destination
              </p>
            </div>

            {/* MENU ITEMS */}
            <div className="py-1">
              <button onClick={() => setOpenProfile(true)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition">
                <User size={18} className="text-gray-700" />
                <span className="text-gray-700 text-sm">Profile</span>
              </button>

              {/* MODAL */}
              <ProfileModal 
                isOpen={openProfile} 
                onClose={() => setOpenProfile(false)}
                onReport={() => {
                  setOpenProfile(false);
                  setOpenReport(true);
                }}
                onAdd={() => {
                  setOpenProfile(false);
                  setOpenAdd(true);
                }}
              />
        
              <ReportDataModal 
                isOpen={openReport} 
                onClose={() => setOpenReport(false)}
              />

              <AddModal 
                isOpen={openAdd} 
                onClose={() => setOpenAdd(false)}
              />

              <button 
                onClick={() => setIsModalOpen(true)} 
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition">
                <Bell size={18} className="text-gray-700" />
                <span className="text-gray-700 text-sm">Notification</span>
              </button>

              {/* Modal Notifikasi */}
              <AlumniNotificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                requests={requests}
                onApprove={handleApproveRequest}
                onDecline={handleDeclineRequest}
              />

              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-red-600">
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
