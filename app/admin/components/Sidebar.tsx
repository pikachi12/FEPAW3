"use client"; // Diperlukan untuk state dropdown dan deteksi 'active' link

import { useState } from 'react';
import Link from 'next/link';
// Import ikon-ikon yang relevan dari react-feather
import { 
  Layout, 
  Users, 
  Briefcase, 
  FileText, 
  LogOut, 
  ChevronDown,
  User as UserIcon,
  type Icon as FeatherIcon // 'User' untuk profil
} from 'react-feather';

interface NavItemProps {
  href: string;
  icon: FeatherIcon;
  label: string;
  isActive?: boolean; // '?' menandakan opsional
  hasDropdown?: boolean;
  onToggle?: () => void; // Tipe data untuk fungsi
  isOpen?: boolean;
}

interface SubNavItemProps {
  href: string;
  label: string;
}

// Sub-komponen kecil untuk Navigasi Item
function NavItem({ 
  href, 
  icon: Icon, // Langsung rename 'icon' menjadi 'Icon'
  label, 
  isActive, 
  hasDropdown, 
  onToggle, 
  isOpen 
}: NavItemProps) {

  return (
    <li>
      <Link
        href={href}
        onClick={(e) => {
          if (hasDropdown) {
            e.preventDefault(); // Mencegah navigasi jika ini adalah dropdown
            if (onToggle) onToggle();
          }
        }}
        className={`
          flex w-full items-center justify-between gap-3 rounded-md px-4 py-2.5
          text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900
          ${isActive ? 'bg-gray-100 font-semibold text-gray-900' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </div>
        {hasDropdown && (
          <ChevronDown 
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </Link>
    </li>
  );
}

// Sub-komponen untuk item di dalam dropdown
function SubNavItem({ href, label }: SubNavItemProps) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-md px-4 py-2 pl-12 text-sm text-gray-600 hover:bg-gray-50"
      >
        {label}
      </Link>
    </li>
  );
}

export default function Sidebar() {
  const [isDataPersonOpen, setDataPersonOpen] = useState(false); // Default open seperti di gambar
  const [isCapstoneTeamsOpen, setCapstoneTeamsOpen] = useState(false);
  const [isCapstoneProjectsOpen, setCapstoneProjectsOpen] = useState(false);

  // Di aplikasi nyata, Anda akan menggunakan `usePathname` untuk menentukan 'isActive'
  const currentPath = '/dashboard'; 

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
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* 1. Logo/Header */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-gray-900">CAPCON</h1>
        <span className="ml-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-600">
          Container
        </span>
      </div>

      {/* 2. Menu Navigasi */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-1">
          <NavItem 
            href="/admin" 
            icon={Layout} 
            label="Dashboard" 
            isActive={currentPath === '/dashboard'}
          />
          
          {/* Item dengan Dropdown */}
          <NavItem 
            href="#" 
            icon={Users} 
            label="Data Person" 
            hasDropdown 
            isOpen={isDataPersonOpen}
            onToggle={() => setDataPersonOpen(!isDataPersonOpen)}
          />
          {/* Konten Dropdown */}
          {isDataPersonOpen && (
            <ul className="mt-1 space-y-1">
              <SubNavItem href="/admin/dashboard/data-person/add-data" label="Add Data" />
              <SubNavItem href="/admin/dashboard/data-person/all-mahasiswa" label="All Mahasiswa/Alumni" />
              <SubNavItem href="/admin/dashboard/data-person/all-dosen" label="All Dosen" />
            </ul>
          )}

          <NavItem 
            href="/dashboard/capstone-teams" 
            icon={Briefcase} 
            label="Capstone Teams" 
            hasDropdown 
            isOpen={isCapstoneTeamsOpen}
            onToggle={() => setCapstoneTeamsOpen(!isCapstoneTeamsOpen)}
            // 'hasDropdown' dan 'isOpen' bisa ditambahkan di sini jika diperlukan
          />
          {isCapstoneTeamsOpen && (
            <ul className="mt-1 space-y-1">
              <SubNavItem href="/admin/dashboard/capstone-teams/add-team" label="Add Team" />
              <SubNavItem href="/admin/dashboard/capstone-teams/all-teams" label="All Teams" />
            </ul>
          )}

          <NavItem 
            href="/dashboard/capstone-projects" 
            icon={FileText} 
            label="Capstone Projects" 
            hasDropdown 
            isOpen={isCapstoneProjectsOpen}
            onToggle={() => setCapstoneProjectsOpen(!isCapstoneProjectsOpen)}
            // 'hasDropdown' dan 'isOpen' bisa ditambahkan di sini jika diperlukan
          />
          {isCapstoneProjectsOpen && (
            <ul className="mt-1 space-y-1">
              <SubNavItem href="/admin/dashboard/capstone-projects/add-project" label="Add Project" />
              <SubNavItem href="/admin/dashboard/capstone-projects/all-projects" label="All Projects" />
            </ul>
          )}

        <div className="mb-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
          
        </ul>
      </nav>

      {/* 3. Footer (Sign Out & User Profile) */}
      <div className="mt-auto border-t border-gray-200 p-4">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{getUserData()?.name}</p>
            <p className="text-xs text-gray-500">{getUserData()?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}