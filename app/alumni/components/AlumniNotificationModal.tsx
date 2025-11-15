// components/AlumniNotificationModal.tsx
"use client";
import { X } from "react-feather";
import type { AlumniRequest } from "../types/types";
import NotificationRequestItem from "./NotificationRequestItem";

interface AlumniNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: AlumniRequest[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function AlumniNotificationModal({
  isOpen,
  onClose,
  requests,
  onApprove,
  onDecline,
}: AlumniNotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start px-4 pt-10 sm:pt-20 pb-20">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg relative">
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
          {requests.map((request) => (
            <NotificationRequestItem
              key={request.id}
              request={request}
              onApprove={onApprove}
              onDecline={onDecline}
            />
          ))}
          
          {/* Tampilkan pesan jika tidak ada request */}
          {requests.length === 0 && (
             <p className="text-gray-500 text-center py-10">
                Tidak ada notifikasi request project baru.
             </p>
          )}
        </div>
      </div>
    </div>
  );
}