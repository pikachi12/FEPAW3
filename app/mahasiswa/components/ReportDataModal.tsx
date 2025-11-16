"use client";
import { X } from "react-feather";
import React, { useEffect, useState } from "react";

interface ReportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportDataModal({ isOpen, onClose }: ReportDataModalProps) {
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setReason(null);
  }, [isOpen]);

  const submitReason = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/report-issue`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description : reason }),
        credentials: "include", // Penting: untuk menerima cookie dari backend
      });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg relative p-6">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Breadcrumb */}
        <p className="text-sm text-gray-500 mb-4">
          User Profile &gt; Report Data
        </p>

        {/* Title */}
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Alasan Pengajuan
        </h2>

        {/* Textarea */}
        <textarea
          value={reason || ""}
          onChange={(e) => setReason(e.target.value)}
          className="
            w-full 
            border border-gray-300 
            rounded-lg 
            p-3 
            text-sm 
            h-32 
            focus:outline-none 
            focus:ring-1 
            focus:ring-orange-500
          "
          placeholder="Ketik di sini (max 100 kata)"
        />

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button onClick={submitReason} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
            Submit Request
          </button>
        </div>

      </div>
    </div>
  );
}
