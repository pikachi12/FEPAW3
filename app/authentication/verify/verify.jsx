import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp
      });

      setMessage("Verifikasi berhasil!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="otp-container">
      <h2>Verifikasi OTP</h2>
      <p>Kode OTP dikirim ke: <b>{email}</b></p>

      <input
        type="text"
        placeholder="Masukkan OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>
        Verifikasi
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
