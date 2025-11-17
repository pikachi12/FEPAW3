// components/NotificationRequestItem.tsx
"use client";
import {
  Calendar,
  Users,
  User,
  FileText,
  Link,
} from "react-feather";
import type { AlumniRequest } from "../types/types";

interface NotificationRequestItemProps {
  request: AlumniRequest;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function NotificationRequestItem({
  request,
  onApprove,
  onDecline,
}: NotificationRequestItemProps) {
  // Determine display status
  let displayStatus: "pending" | "Approved" | "Declined" = "pending";
  if (request.status === "Diterima" || request.status === "approved") {
    displayStatus = "Approved";
  } else if (request.status === "Ditolak" || request.status === "declined") {
    displayStatus = "Declined";
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white">
      <p className="text-gray-700 font-medium mb-1">Request Project</p>
      
      {/* Date */}
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-700" />
          <span className="sm:w-32 text-gray-500">Date</span>
        </div>
        <span className="text-gray-800">
          {request.date}{" "}
            {displayStatus === "pending" && (
              <span className="text-red-500 text-xs">
                ({request.remainingDays} days remaining)
              </span>
            )}
        </span>
      </div>

      <div className="mb-2" />

      {/* Nama Tim */}
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-gray-700" />
          <span className="sm:w-32 text-gray-500">Nama Tim</span>
        </div>
        <span className="text-gray-800 font-medium">{request.teamName}</span>
      </div>

      <div className="border-t border-gray-100 my-4"></div>

      <p className="text-gray-700 font-medium mb-3">Detail Tim</p>

        <div className="text-sm space-y-2">
        {/* Nama Ketua Tim */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start">
          <div className="flex items-center gap-2">
            <User size={18} className="text-gray-700" />
            <span className="sm:w-32 text-gray-500">Nama Ketua Tim</span>
          </div>
          <span className="text-gray-800 leading-relaxed">
            {request.ketua.name}
            <span className="hidden sm:inline text-gray-500"> ({request.ketua.details})</span>
          </span>
        </div>

        {/* Nama Anggota Tim - hanya tampil di sm ke atas */}
        <div className="hidden sm:flex flex-col sm:flex-row gap-1 sm:gap-3 items-start">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-700" />
            <span className="sm:w-32 text-gray-500">Nama Anggota Tim</span>
          </div>
          <div className="text-gray-800 leading-relaxed space-y-1">
            {request.anggota.map((item) => (
              <p key={item.name}>
                {item.name}
                <span className="hidden sm:inline text-gray-500"> ({item.details})</span>
              </p>
            ))}
          </div>
        </div>

        {/* Dosen Pembimbing */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start">
          <div className="flex items-center gap-2">
            <User size={18} className="text-gray-700" />
            <span className="sm:w-32 text-gray-500">Dosen Pembimbing</span>
          </div>
          <span className="text-gray-800 leading-relaxed">
            {request.dosen.name || "-"}
            <span className="hidden sm:inline text-gray-500"> ({request.dosen.details || "-"})</span>
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 my-4"></div>

      {/* Alasan Pengajuan */}
      <p className="text-gray-700 font-medium mb-3 flex items-center gap-2">
        <FileText size={16} /> Alasan Pengajuan
      </p>
      <p className="text-sm text-gray-800 mb-2">{request.alasan}</p>

      <div className="border-t border-gray-100 my-4"></div>

      {/* Link Berkas */}
      <p className="text-gray-700 font-medium mb-3 flex items-center gap-2">
        <Link size={16} /> Link berkas
      </p>
      <a
        href={request.driveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 no-underline mb-2 block text-sm"
      >
        Lihat Berkas
      </a>

      {/* Action Footer */}
      <div className="border-t border-gray-200 mt-5"></div>
      <div className="flex justify-end gap-3 pt-4">
        {displayStatus === "pending" ? (
          <>
            <button
              onClick={() => onDecline(request.groupId)}
              className="px-6 py-2 rounded-lg border border-orange-500 text-orange-500 bg-transparent hover:bg-orange-50 text-sm font-medium"
            >
              Decline
            </button>
            <button
              onClick={() => onApprove(request.groupId)}
              className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-sm font-medium"
            >
              Approve
            </button>
          </>
        ) : displayStatus === "Approved" ? (
          <span className="font-medium text-sm text-green-600">Approved</span>
        ) : (
          <span className="font-medium text-sm text-red-600">Declined</span>
        )}
      </div>
    </div>
  );
}