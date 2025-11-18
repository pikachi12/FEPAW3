"use client";
import { X, Calendar, FileText, File, Clipboard } from "react-feather";
import React, { useEffect, useState } from "react";

export interface NotificationItem {
  date: string;
  judul: string;
  status: "Menunggu Review" | "Ditolak" | "Diterima";
  driveLink?: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
}

export default function NotificationModal({
  isOpen,
  onClose,
  notifications,
}: NotificationModalProps) {
  const [notificationsState, setNotifications] = useState<NotificationItem[]>(notifications);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isOpen) return;

      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/my-requests`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();

        const mapped: NotificationItem[] = data.requests.map((req: any) => ({
          date: new Date(req.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          judul: req.capstone.judul,
          status: req.status,
          driveLink:
            req.status === "Diterima"
              ? req.capstone.proposalUrl || null
              : undefined,
        }));

        setNotifications(mapped);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  notifications = notificationsState;

  // Helper row
  const DetailRow = ({
    Icon,
    label,
    value,
    isLink = false,
    linkHref = "",
  }: {
    Icon: React.ElementType;
    label: string;
    value: string;
    isLink?: boolean;
    linkHref?: string;
  }) => {
    let valueClasses = "text-gray-800";

    if (label === "Status") {
      valueClasses =
        value === "Diterima"
          ? "text-green-600 font-medium"
          : value === "Ditolak"
          ? "text-red-600 font-medium"
          : "text-yellow-500 font-medium";
    }

    return (
      <div className="flex flex-col sm:flex-row justify-between items-start py-1 gap-1 sm:gap-0">
        <div className="flex gap-2 items-start sm:w-1/3">
          <Icon size={18} className="text-gray-500 mt-[2px]" />
          <p className="text-gray-500">{label}</p>
        </div>

        <div className="flex-1 min-w-0">
          {isLink ? (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 break-words"
            >
              Lihat proposal
            </a>
          ) : (
            <p className={valueClasses + " break-words"}>
              {label === "Judul"
                ? value.split(/\s*\(([^)]*)\)/)[0]
                : value}

              {label === "Judul" && (
                <span className="hidden sm:inline text-gray-500 ml-2">
                  {(() => {
                    const match = value.match(/\(([^)]*)\)/);
                    return match ? `(${match[1]})` : "";
                  })()}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 px-4
        transition-opacity duration-200
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      {/* BACKDROP — blur muncul dulu */}
      <div
        className={`
          absolute inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-200
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* MODAL — muncul dengan fade + scale */}
      <div
        className={`
          bg-white w-full max-w-4xl rounded-xl shadow-lg relative
          transition-all duration-300 ease-out
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 pb-2 flex justify-between items-center">
          <p className="text-lm text-gray-500">Notification</p>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-t border-gray-200 mb-4" />

        {/* Notification List */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-4 sm:px-6 pb-6">
          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading...</p>
          ) : (
            notifications.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5 bg-white"
              >
                <p className="text-gray-700 font-medium mb-4">
                  Request Project Feedback
                </p>

                <div className="space-y-1 text-sm">
                  <DetailRow Icon={Calendar} label="Date" value={item.date} />
                  <DetailRow Icon={FileText} label="Judul" value={item.judul} />
                  <DetailRow Icon={Clipboard} label="Status" value={item.status} />

                  {item.status === "Diterima" && item.driveLink && (
                    <DetailRow
                      Icon={File}
                      label="Dokumen Proposal"
                      value={item.driveLink}
                      isLink={true}
                      linkHref={item.driveLink}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
