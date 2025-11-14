"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "react-feather";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      // Simpan token
      localStorage.setItem("token", data.token);

      // Redirect ke dashboard
      router.push("/");

    } catch (error) {
      setErrorMsg("Gagal terhubung ke server");
    }

    setLoading(false);
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-gray-900">
      {/* Background Image */}
      <Image
        src="/auth-bg.jpg"
        alt="Background"
        fill
        className="object-cover opacity-80"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Back link */}
      <div className="absolute top-8 right-10 text-sm text-white hover:underline flex items-center gap-1">
        <Link href="/" className="flex items-center gap-1">
          Back to main page <ArrowRight size={14} />
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="CAPCON logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <div className="text-white">
              <p className="font-semibold">CAPCON</p>
              <p className="text-xs text-gray-200 -mt-1">Capstone Container</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 w-full">
          <h2 className="text-xl font-semibold text-center text-gray-900">
            Welcome Back!
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Complete these form to <span className="font-medium text-gray-700">login</span> your account
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="@mail.ugm.ac.id or @ugm.ac.id"
                  className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-gray-700 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
