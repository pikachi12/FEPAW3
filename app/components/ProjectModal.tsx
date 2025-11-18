// components/ProjectModal.jsx

import React from 'react';
import { X } from 'react-feather';
import { Project } from '@/app/page';
import toast from 'react-hot-toast';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    const [showFullAbstract, setShowFullAbstract] = React.useState(false);
    const [alasan, setAlasan] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    // Hapus successMessage, pakai toast
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    React.useEffect(() => {
      if (typeof window !== "undefined") {
        setIsLoggedIn(!!localStorage.getItem("user"));
      }
    }, []);

  if (!project) return null;

  // Menentukan status ketersediaan
  const isAvailable = project.status === 'Available';
  
  // Menentukan alasan tidak tersedia
  let notAvailableReason = '';
  if (project.status === 'NotAvailable_Taken') {
    notAvailableReason = `(diambil oleh tim ${project.takenBy})`;
  } else if (project.status === 'NotAvailable_Limit') {
    notAvailableReason = '(telah mendapatkan 3 request dalam 1 waktu)';
  }

  const handleSubmit = async () => {
    if (!alasan.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/pilih-capstone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          capstoneId: project.id,
          alasan: alasan,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Gagal mengirim pengajuan.");
      } else {
        toast.success("Pengajuan capstone Anda berhasil dikirim!");
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi error, coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Notifikasi custom dihapus, toast akan muncul otomatis */}
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat klik di dalam modal
      >
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          {/* <-- DIUBAH: Menggunakan komponen ikon X --> */}
          <X className="h-6 w-6" /> 
        </button>

        {/* Header */}
        <p className="mb-2 text-sm text-gray-500">{project.category}</p>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">{project.title}</h2>

        {/* Status Section */}
        <div className="mb-4 flex items-center">
          {isAvailable ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Available
            </span>
          ) : (
            <>
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                Not Available
              </span>
              <span className="ml-2 text-sm text-red-600">
                {notAvailableReason}
              </span>
            </>
          )}
        </div>

        {/* Kolom Kiri: Detail Tim & Dosen */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="mb-2 font-semibold text-gray-800">Nama Anggota Tim</h3>
            <ul className="list-inside list-none space-y-1 text-sm text-gray-600">
              {project.teamMembers.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>

            <h3 className="mt-6 mb-2 font-semibold text-gray-800">Dosen Pembimbing</h3>
            <ul className="list-inside list-none space-y-1 text-sm text-gray-600">
              {project.supervisors.map((supervisor, index) => (
                <li key={index}>{supervisor}</li>
              ))}
            </ul>
          </div>

          {/* Kolom Kanan: Abstrak, Hasil, dll. */}
          <div className="md:col-span-2">
            <h3 className="mb-2 font-semibold text-gray-800">Abstrak</h3>
            <p className="mb-4 text-sm text-gray-600">
              {showFullAbstract || !project.abstract || project.abstract.length <= 300
                ? project.abstract
                : project.abstract.slice(0, 300) + "..."}
              {project.abstract && project.abstract.length > 300 && (
                <button
                  type="button"
                  className="ml-2 text-xs text-blue-600 underline hover:text-blue-800"
                  onClick={() => setShowFullAbstract((v) => !v)}
                >
                  {showFullAbstract ? "Tutup" : "Lihat Selengkapnya"}
                </button>
              )}
            </p>


            <h3 className="mb-2 font-semibold text-gray-800">Hasil</h3>
            {project.hasil && project.hasil.length > 0 ? (
              <div className="mb-4 flex flex-wrap gap-4">
                {project.hasil.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Hasil ${index + 1}`}
                    className="h-24 w-24 rounded border object-cover"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">Belum ada hasil yang tersedia.</p>
            )}

            <h3 className="mb-2 font-semibold text-gray-800">Alasan Pengajuan</h3>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              rows={3}
              placeholder="Ketik di sini (max 100 kata)"
              disabled={!isAvailable} // Textarea juga di-disable jika not available
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
            ></textarea>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!isAvailable || isSubmitting || !isLoggedIn}
                className={`rounded-lg px-6 py-2 text-white font-medium flex items-center gap-2
                  ${isAvailable && isLoggedIn
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {isSubmitting ? (
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : !isLoggedIn ? (
                  "Login untuk Submit"
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}