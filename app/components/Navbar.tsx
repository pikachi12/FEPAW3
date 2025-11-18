"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isLoggedIn as checkLoggedIn } from "@/lib/auth";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setIsLoggedIn(checkLoggedIn());

    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setRole(user.role);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  // 🔥 Determine dashboard path
  const getDashboardRoute = () => {
    if (!role) return "/";

    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "student":
      case "user":
        return "/profile";
      default:
        return "/";
    }
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 border-b bg-white sticky top-0 z-20 h-16">
      <div className="flex items-center gap-2">
        <div className="font-bold text-lg">CAPCON</div>
        <span className="text-sm text-gray-500">Capstone Container</span>
      </div>

      <div className="space-x-4">
        {!isLoggedIn ? (
          <>
            <span className="hidden sm:inline">
              <Link href="/register">
                <button className="border border-orange-500 text-orange-500 px-4 py-2 rounded-md bg-white hover:bg-orange-50 transition">
                  Register
                </button>
              </Link>
            </span>

            <Link href="/login">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
                Login
              </button>
            </Link>
          </>
        ) : (
          <>
            {/* 🔥 Dashboard Button */}
            <Link href={getDashboardRoute()}>
              <button className="text-gray-700 hover:text-black">
                Dashboard
              </button>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
