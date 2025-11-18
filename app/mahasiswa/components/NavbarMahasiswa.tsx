"use client";

import { use, useEffect, useState } from "react";
import { User, Bell, LogOut } from "react-feather";
import ProfileModal from "./ProfileModal";
import ReportDataModal from "./ReportDataModal";
import AddModal from "./AddModal";
import NotificationModal from "./NotificationModal";


export default function NavbarMahasiswa() {
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const getUserData = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
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
    <>
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
            className="flex items-center gap-3 transition-transform active:scale-95"
          >
            {/* Avatar */}
            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>

            {/* User info */}
            <div className="hidden sm:block text-left">
              <p className="font-semibold text-gray-800">{getUserData()?.name}</p>
              <p className="text-gray-500 text-sm">{getUserData()?.email}</p>
            </div>
          </button>

          {/* DROPDOWN */}
          <div
            className={`absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg border z-30 transition-all duration-200 ease-out
              ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            style={{ transformOrigin: 'top right' }}
          >
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
               <button 
                 onClick={() => {
                   setOpenProfile(true);
                   setOpen(false);
                 }} 
                 className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
               >
                <User size={18} className="text-gray-700" />
                <span className="text-gray-700 text-sm">Profile</span>
              </button>

              <button 
                onClick={() => {
                  setOpenNotif(true);
                  setOpen(false);
                }} 
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
              >
                <Bell size={18} className="text-gray-700" />
                <span className="text-gray-700 text-sm">Notification</span>
              </button>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-red-600"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MODALS - Di luar header agar tampil di tengah layar */}
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

      <NotificationModal
        isOpen={openNotif}
        onClose={() => setOpenNotif(false)}
        notifications={[]}
      />
    </>
  );
}