// components/ProjectModal.jsx

import React from 'react';
import { X } from 'react-feather';
import { Project } from '@/app/page'; 

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    const [showFullAbstract, setShowFullAbstract] = React.useState(false);
  const [alasan, setAlasan] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

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
      // Ambil pesan error dari response
      setIsSubmitting(false);
      setSuccessMessage(data.message || "Gagal mengirim pengajuan.");
      setTimeout(() => setSuccessMessage(""), 2500);
      return;
    }

    setSuccessMessage("Pengajuan capstone Anda berhasil dikirim!");

    setTimeout(() => {
      setSuccessMessage("");
      onClose(); // tutup modal
    }, 1500);

  } catch (error) {
    console.error(error);

    setSuccessMessage("Terjadi error, coba lagi.");
    setTimeout(() => setSuccessMessage(""), 2500);

  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      {successMessage && (
        <div className="fixed top-5 right-5 z-[9999] animate-fade-in">
          <div className="bg-orange-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <span className="font-semibold">Request Terkirim</span>
            <p className="text-sm opacity-90">{successMessage}</p>
          </div>
        </div>
      )}
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
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
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              {project.teamMembers.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>

            <h3 className="mt-6 mb-2 font-semibold text-gray-800">Dosen Pembimbing</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              {project.supervisors.map((supervisor, index) => (
                <li key={index}>{supervisor}</li>
              ))}
            </ul>
          </div>

          {/* Kolom Kanan: Abstrak, Hasil, dll. */}
          <div className="md:col-span-2">
            <h3 className="mb-2 font-semibold text-gray-800 flex items-center gap-2">
              Abstrak
              {project.abstract && project.abstract.length > 300 && (
                <button
                  type="button"
                  className="ml-2 text-xs text-blue-600 underline hover:text-blue-800"
                  onClick={() => setShowFullAbstract((v) => !v)}
                >
                  {showFullAbstract ? "Tutup" : "Lihat Selengkapnya"}
                </button>
              )}
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              {showFullAbstract || !project.abstract || project.abstract.length <= 300
                ? project.abstract
                : project.abstract.slice(0, 300) + "..."}
            </p>

            <h3 className="mb-2 font-semibold text-gray-800">Kata Kunci</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.keywords.map((keyword, index) => (
                <span key={index} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                  {keyword}
                </span>
              ))}
            </div>

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
                disabled={!isAvailable || isSubmitting}
                className={`rounded-lg px-6 py-2 text-white font-medium flex items-center gap-2
                  ${isAvailable 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {isSubmitting ? (
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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