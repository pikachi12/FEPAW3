'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Shield } from 'react-feather';

export default function OTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email"); 

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Set email setelah page render
  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);

  // Handle OTP Submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "OTP verification failed");
        setLoading(false);
        return;
      }

      alert("OTP verified! Your account is now active.");
      router.push("/login");

    } catch (err) {
      alert("Error connecting to server.");
    }

    setLoading(false);
  };

  // Handle Resend OTP
  const handleResend = async () => {
    setResendLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
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

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-gray-900">
      
      <Image src="/auth-bg.jpg" alt="Background" fill className="object-cover opacity-80" priority />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="CAPCON logo" width={32} height={32} className="rounded-sm" />
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
            A verification code has been sent to <br />
            <span className="font-medium text-gray-700">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center tracking-widest font-medium text-lg rounded-md border border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md transition"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Didn’t get a code?{" "}
            <button 
              onClick={handleResend}
              disabled={resendLoading}
              className="text-orange-600 hover:underline font-medium"
            >
              {resendLoading ? "Sending..." : "Click to resend"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
