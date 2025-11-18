// components/AlumniNotificationModal.tsx
"use client";
import { X } from "react-feather";
import type { AlumniRequest } from "../types/types";
import NotificationRequestItem from "./NotificationRequestItem";
import { useEffect, useState } from "react";
import fetchAlumniInboxRequests from "../utils/fetchAlumniInbox";

interface AlumniNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function AlumniNotificationModal({
  isOpen,
  onClose,
  onApprove,
  onDecline,
}: AlumniNotificationModalProps) {
  const [requests, setRequests] = useState<AlumniRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Handler untuk approve/decline yang juga fetch ulang data
  const handleAction = async (action: 'approve' | 'decline', id: string) => {
    setLoading(true);
    try {
      if (action === 'approve') {
        await onApprove(id);
      } else {
        await onDecline(id);
      }
      // Fetch ulang data inbox
      const updated = await fetchAlumniInboxRequests();
      setRequests(updated);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchAlumniInboxRequests()
      .then((data) => setRequests(data))
      .finally(() => setLoading(false));
  }, [isOpen]);

  return (
      <div
        className={`fixed inset-0 z-50 flex justify-center items-center px-4
          transition-opacity duration-200
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
      {/* BACKDROP – Fade duluan */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-200
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* MODAL BOX – Animasi scale + fade menyusul */}
      <div
        className={`bg-white w-full max-w-4xl rounded-xl shadow-lg relative
          transition-all duration-300 ease-out
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 pb-2 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">Notification</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Daftar Notifikasi (Bisa di-scroll) */}
        <div className="space-y-4 max-h-[75vh] overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading...</p>
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <NotificationRequestItem
                key={request.id}
                request={request}
                onApprove={(id) => handleAction('approve', id)}
                onDecline={(id) => handleAction('decline', id)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">
              Tidak ada notifikasi request project baru.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}