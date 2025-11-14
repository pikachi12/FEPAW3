"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true kalau token ada
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect ke login
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="font-bold text-lg">CAPCON</div>
        <span className="text-sm text-gray-500">Capstone Container</span>
      </div>

      <div className="space-x-4">
        {!isLoggedIn ? (
          <>
            <Link href="/register">
              <button className="text-gray-700 hover:text-black">Register</button>
            </Link>

            <Link href="/login">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
                Login
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard">
              <button className="text-gray-700 hover:text-black">Dashboard</button>
            </Link>

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
