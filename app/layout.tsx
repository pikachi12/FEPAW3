import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Capcon - Capstone Container",
  description: "Discover Capstone Projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Toaster position="top-right" toastOptions={{
          style: { fontSize: "1rem", borderRadius: "8px", background: "#fff", color: "#333" },
          success: { style: { background: "#e0ffe0", color: "#1a7f37" } },
          error: { style: { background: "#ffe0e0", color: "#d32f2f" } }
        }} />
        {children}
      </body>
    </html>
  );
}
