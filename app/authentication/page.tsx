'use client';

import Image from 'next/image';
import { Shield } from 'react-feather';

export default function RegisterPage() {
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
              <div className="relative z-10 bg-white rounded-xl shadow-xl p-8 w-[380px]">
        <div className="flex justify-center mb-3">
          <Shield className="text-orange-600" size={32} />
        </div>
        <h2 className="text-xl font-semibold text-center mb-2">Enter verification code</h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          A verification code has been sent to your university email.
        </p>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="text-center tracking-widest font-medium text-lg rounded-md border border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md transition"
          >
            Verify
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Didn’t get a code?{' '}
          <button className="text-orange-600 hover:underline font-medium">
            Click to resend
          </button>
        </p>
      </div>
      </div>
    </div>
  );
}
