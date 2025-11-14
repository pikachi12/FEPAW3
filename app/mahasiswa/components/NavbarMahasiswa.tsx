"use client";

import { useState } from "react";
import { User, Bell, LogOut } from "react-feather";
import Link from "next/link";
import ProfileModal from "./ProfileModal";
import ReportDataModal from "./ReportDataModal";
import AddModal from "./AddModal";

export default function NavbarMahasiswa() {
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

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

          {/* User info */}
          <div className="hidden sm:block text-left">
            <p className="font-semibold text-gray-800">Hanifah Putri Ariani</p>
            <p className="text-gray-500 text-sm">hanifahputriariani@mail.ugm.ac.id</p>
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

              <Link href="/notification"><button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition">
                <Bell size={18} className="text-gray-700" />
                <span className="text-gray-700 text-sm">Notification</span>
              </button></Link>

              <Link href="/"><button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-red-600">
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button></Link>
            </div>

          </div>
        )}
      </div>
    </header>
  );
}
