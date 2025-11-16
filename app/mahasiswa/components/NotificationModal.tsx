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

    useEffect(() => {
      const fetchNotifications = async () => {
      if (!isOpen) return;

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
          status: req.status, // Menunggu Review, Ditolak, Diterima
          driveLink: req.status === "Diterima" 
            ? req.capstone.proposalUrl || null 
            : undefined
        }));
        setNotifications(mapped);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, [isOpen]);
  
  notifications = notificationsState;
    
    if (!isOpen) return null;

    // Helper component for a single detail row
    const DetailRow = ({ Icon, label, value, isLink = false, linkHref = "" }: {
      Icon: React.ElementType;
      label: string;
      value: string;
      isLink?: boolean;
      linkHref?: string;
    }) => {
      // Determine text color for Status
      let valueClasses = "text-gray-800";
      if (label === "Status") {
        valueClasses =
          value === "Diterima"
            ? "text-green-600 font-medium"
            : value === "Ditolak"
            ? "text-red-600 font-medium"
            : "text-yellow-500 font-medium"; // Menunggu Review
      }

      return (
        <div className="flex justify-between items-start py-1">
          
          {/* Left side: Icon and Label (Date, Judul, Status, Dokumen Proposal) */}
          <div className="flex gap-2 items-start w-1/3">
            <Icon size={18} className="text-gray-500 mt-[2px]" />
            <p className="text-gray-700">{label}</p>
          </div>

          {/* Right side: Value */}
          <div className="flex-1 min-w-0">
            {isLink ? (
              <a
                href={linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-black underline break-words"
              >
                {value}
              </a>
            ) : (
              <p className={valueClasses + " break-words"}>{value}</p>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start px-4 pt-20">
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg relative"> {/* Removed p-6 here */}

          {/* Header - Notification Title and Close Button */}
          <div className="p-4 sm:p-6 pb-2 flex justify-between items-center">
              <p className="text-lm text-gray-500">Notification</p>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
          </div>

          <div className="border-t border-gray-200 mb-4"></div>

          {/* Notification List */}
          <div className="space-y-4 max-h-[70vh] overflow-y-auto px-4 sm:px-6 pb-6 pt-0">

            {notifications.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5 bg-white"
              >
                <p className="text-gray-700 font-medium mb-4">
                  Request Project Feedback
                </p>

                <div className="space-y-1 text-sm">
                  
                  {/* DATE */}
                  <DetailRow Icon={Calendar} label="Date" value={item.date} />

                  {/* JUDUL */}
                  <DetailRow Icon={FileText} label="Judul" value={item.judul} />

                  {/* STATUS */}
                  <DetailRow Icon={Clipboard} label="Status" value={item.status} />

                  {/* DRIVE LINK — ONLY IF APPROVED */}
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
            ))}
          </div>

        </div>
      </div>
    );
  }
