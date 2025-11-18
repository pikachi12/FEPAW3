"use client";

import { useState, useEffect } from 'react';
import { Menu } from 'react-feather';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Layout, 
  Users, 
  Briefcase, 
  FileText, 
  LogOut, 
  ChevronDown,
  User as UserIcon,
  X,
  type Icon as FeatherIcon
} from 'react-feather';

interface NavItemProps {
  href: string;
  icon: FeatherIcon;
  label: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  onToggle?: () => void;
  isOpen?: boolean;
}

interface SubNavItemProps {
  href: string;
  label: string;
}

// --- Sub-komponen NavItem ---
function NavItem({ 
  href, 
  icon: Icon, 
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
            e.preventDefault();
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

// --- Sub-komponen SubNavItem ---
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
  const [isDataPersonOpen, setDataPersonOpen] = useState(false);
  const [isCapstoneTeamsOpen, setCapstoneTeamsOpen] = useState(false);
  const [isCapstoneProjectsOpen, setCapstoneProjectsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State untuk user data agar aman dari Hydration Error
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  const pathname = usePathname();
  const currentPath = pathname;

  // Ambil data user hanya setelah komponen di-mount (client-side)
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

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
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow md:hidden border border-gray-200"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR UTAMA */}
      <aside
        className={`
          /* Mobile Styles: Fixed position, full height */
          fixed left-0 top-0 z-50 h-screen
          
          /* Desktop Styles: Sticky position, full height */
          md:sticky md:top-0 md:z-0 md:h-screen

          /* Common Styles */
          flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        {/* 1. Logo/Header */}
        <div className="flex h-16 items-center px-6 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900">CAPCON</h1>
          <span className="ml-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-600">
            Container
          </span>
          <button
            className="ml-auto md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 2. Menu Navigasi (Scrollable area) */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            <NavItem 
              href="/admin" 
              icon={Layout} 
              label="Dashboard" 
              isActive={currentPath === '/admin'}
            />
            
            <NavItem 
              href="#" 
              icon={Users} 
              label="Data Person" 
              hasDropdown 
              isOpen={isDataPersonOpen}
              onToggle={() => setDataPersonOpen(!isDataPersonOpen)}
            />
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
              isActive={currentPath.startsWith('/admin/dashboard/capstone-teams')}
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
              isActive={currentPath.startsWith('/admin/dashboard/capstone-projects')}
            />
            {isCapstoneProjectsOpen && (
              <ul className="mt-1 space-y-1">
                <SubNavItem href="/admin/dashboard/capstone-projects/add-project" label="Add Project" />
                <SubNavItem href="/admin/dashboard/capstone-projects/all-projects" label="All Projects" />
              </ul>
            )}

            <div className="pt-4">
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

        {/* 3. Footer (User Profile) */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600">
              <UserIcon className="h-6 w-6" />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user ? user.name : 'Loading...'}
              </p>
              <p className="truncate text-xs text-gray-500">
                {user ? user.email : '...'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}