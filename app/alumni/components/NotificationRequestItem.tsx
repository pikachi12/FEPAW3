// components/NotificationRequestItem.tsx
"use client";
import {
  Calendar,
  Users,
  User,
  FileText,
  Link,
} from "react-feather";
import type { AlumniRequest } from "../types/types"; // Impor tipe data

// Buat komponen helper untuk baris info agar rapi
const InfoRow = ({
  Icon,
  label,
  children,
}: {
  Icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 flex gap-2 items-center w-40 text-gray-500">
      <Icon size={16} />
      <span className="text-sm">{label}</span>
    </div>
    <div className="flex-1 text-sm text-gray-800">{children}</div>
  </div>
);

// Komponen Footer Aksi (Tombol atau Status)
const ActionFooter = ({
  status,
  onRequestDecline,
  onRequestApprove,
}: {
  status: "pending" | "approved" | "declined";
  onRequestDecline: () => void;
  onRequestApprove: () => void;
}) => {
  // Jika status 'pending', tampilkan tombol
  if (status === "pending") {
    return (
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onRequestDecline}
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
        >
          Declined
        </button>
        <button
          onClick={onRequestApprove}
          className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-sm font-medium"
        >
          Approved
        </button>
      </div>
    );
  }

  // Jika status 'approved' atau 'declined', tampilkan status
  return (
    <div className="flex justify-end pt-4">
      {status === "approved" && (
        <span className="font-medium text-sm text-green-600">Approved</span>
      )}
      {status === "declined" && (
        <span className="font-medium text-sm text-red-600">Declined</span>
      )}
    </div>
  );
};

// Komponen Item Utama
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
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white">
      <p className="text-gray-700 font-medium mb-1">Request Project</p>
      <InfoRow Icon={Calendar} label="Date">
        {request.date}{" "}
        <span className="text-red-500 text-xs">
          ({request.daysRemaining} days remaining)
        </span>
      </InfoRow>
      <InfoRow Icon={Users} label="Nama Tim">
        <span className="font-medium">{request.teamName}</span>
      </InfoRow>

      <div className="border-t border-gray-100 my-4"></div>

      <p className="text-gray-700 font-medium mb-3">Detail Tim</p>
      <div className="space-y-2">
        <InfoRow Icon={User} label="Nama Ketua Tim">
          {request.ketua.name} ({request.ketua.details})
        </InfoRow>

        <InfoRow Icon={Users} label="Nama Anggota Tim">
          <ol className="list-decimal list-inside">
            {request.anggota.map((item) => (
              <li key={item.name}>
                {item.name} ({item.details})
              </li>
            ))}
          </ol>
        </InfoRow>

        <InfoRow Icon={User} label="Dosen Pembimbing">
          {request.dosen.name} ({request.dosen.details})
        </InfoRow>
      </div>

      <div className="border-t border-gray-100 my-4"></div>

      <p className="text-gray-700 font-medium mb-3">Alasan Pengajuan</p>
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-40 flex gap-2 items-start text-gray-500">
          <FileText size={16} />
          <span className="text-sm">Alasan</span>
        </div>
        <p className="flex-1 text-sm text-gray-800">{request.alasan}</p>
      </div>

      <div className="border-t border-gray-100 my-4"></div>

      <p className="text-gray-700 font-medium mb-3">Pengarsipan Tim</p>
      <InfoRow Icon={Link} label="Google Drive">
        <a
          href={request.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {request.driveLink}
        </a>
      </InfoRow>

      {/* FOOTER AKSI KONDISIONAL */}
      <div className="border-t border-gray-200 mt-5"></div>
      <ActionFooter
        status={request.status}
        onRequestDecline={() => onDecline(request.id)}
        onRequestApprove={() => onApprove(request.id)}
      />
    </div>
  );
}