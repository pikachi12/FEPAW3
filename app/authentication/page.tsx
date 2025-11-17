"use client";

import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OTPPage() {
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Set email setelah page render
  useEffect(() => {
    // Ambil email dari URL query param menggunakan API browser standar
    const searchParams = new URLSearchParams(window.location.search);
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) setEmail(emailFromQuery);

    // Fokus ke input pertama saat komponen dimuat
    inputRefs.current[0]?.focus();
  }, []); // Jalankan sekali saat mount


  // Handle OTP Submission
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    // Hanya izinkan angka
    if (value && isNaN(Number(value))) return;

    const newOtp = [...otp];

    // Handle paste (jika nilai yang dimasukkan lebih dari 1 digit)
    if (value.length > 1) {
      const pasteDigits = value.split('').filter(d => !isNaN(Number(d))).slice(0, 6 - index);
      for (let i = 0; i < pasteDigits.length; i++) {
        if (index + i < 6) {
          newOtp[index + i] = pasteDigits[i];
        }
      }
      setOtp(newOtp);
      
      // Fokus ke kotak terakhir yang diisi
      const lastPastedIndex = Math.min(index + pasteDigits.length, 5);
      inputRefs.current[lastPastedIndex]?.focus();

    } else {
      // Handle pengetikan satu digit atau penghapusan
      newOtp[index] = value; // value akan menjadi '' saat dihapus
      setOtp(newOtp);

      // Pindahkan fokus ke depan jika satu digit dimasukkan
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle tombol Backspace
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Jika backspace ditekan di kotak kosong, pindah fokus ke kotak sebelumnya
      inputRefs.current[index - 1]?.focus();
    }
  };

  
  // Handle OTP Submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // Gabungkan array OTP menjadi satu string
    const otpCode = otp.join("");

    // Validasi apakah OTP sudah 6 digit
    if (otpCode.length !== 6) {
      // Menggunakan alert bawaan, karena ini adalah pengganti untuk 'next/navigation'
      alert("Please enter a valid 6-digit code.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // Kirim kode OTP yang sudah digabung
        body: JSON.stringify({ email, otp: otpCode }),
      }); 

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "OTP verification failed");
        setLoading(false);
        return;
      }

      // alert("OTP verified! Your account is now active.");

      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect sesuai role
      const role = data.user.role;
      window.location.href = `/${role}`;

    } catch (err) {
      alert("Error connecting to server.");
    }

    setLoading(false);
  };

  // Handle Resend OTP
  const handleResend = async () => {
    setResendLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to resend OTP");
        setResendLoading(false);
        return;
      }

      alert("OTP sent again to your email!");

    } catch (err) {
      alert("Error connecting to server");
    }

    setResendLoading(false);
  };

  // Komponen SVG Ikon Shield (Pengganti React-Feather)
  const ShieldIcon = ({ className = "", size = 32 }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-gray-900">
      
      {/* Menggunakan tag <img> standar, menggantikan next/image */}
      <img 
        src="/auth-bg.jpg" 
        alt="Background" 
        // Meniru prop 'fill' dengan kelas Tailwind
        className="absolute inset-0 w-full h-full object-cover opacity-80" 
        onError={(e) => (e.currentTarget.src = 'https://placehold.co/1920x1080/111827/4b5563?text=Team+Working')}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2">
            {/* Menggunakan tag <img> standar */}
            <img 
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
            {/* Menggunakan komponen SVG inline */}
            <ShieldIcon className="text-orange-600" size={32} />
          </div>

          <h2 className="text-xl font-semibold text-center mb-2">Enter verification code</h2>

          <p className="text-sm text-gray-500 text-center mb-5">
            A verification code has been sent to <br />
            {/* Tambahkan fallback jika email belum ter-load */}
            <span className="font-medium text-gray-700">{email || "your-email@example.com"}</span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* 6 Kotak Input OTP */}
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  // Simpan ref ke setiap input
                  ref={(el) => {inputRefs.current[index] = el}}
                  type="text"
                  inputMode="numeric" // Membantu memunculkan numpad di mobile
                  pattern="\d{1}" // Validasi 1 digit
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-xl font-medium rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              ))}
            </div>

            <button
              type="submit"
              // Nonaktifkan tombol jika sedang loading ATAU jika OTP belum 6 digit
              disabled={loading || otp.join("").length !== 6}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Didn’t get a code?{" "}
            <button 
              onClick={handleResend}
              disabled={resendLoading}
              className="text-orange-600 hover:underline font-medium disabled:text-gray-500 disabled:no-underline"
            >
              {resendLoading ? "Sending..." : "Click to resend"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
