"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();



  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
      <p>Selamat datang, Admin!</p>

      <button
        onClick={() => {
          localStorage.removeItem("role");
          router.push("/");
        }}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </main>
  );
}
