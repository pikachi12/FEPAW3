'use client';

import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "react-feather"; 
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name] = useState("");   // optional
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password,
          name 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Success → Redirect to OTP page
      router.push(`/authentication?email=${email}`);

    } catch (err) {
      alert("Failed to connect to server.");
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

        {/* Logo & Title */}
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
            Get Started with Us
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Complete these form to <span className="font-medium text-gray-700">register</span> your account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="@mail.ugm.ac.id or @ugm.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  placeholder="your password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-gray-700 hover:underline">
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
