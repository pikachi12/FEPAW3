// Import ikon-ikon yang relevan
// Import ikon-ikon yang relevan
import { Calendar, Users, AlertCircle, ChevronLeft, ChevronRight, type Icon as FeatherIcon } from 'react-feather';
import { useEffect, useState } from 'react';

interface DetailRowProps {
  icon: FeatherIcon; // Tipe 'icon' adalah komponen React dari feather
  label: string;
  value: string | number; // 'value' bisa string atau angka
}

// Sub-komponen untuk baris detail
function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-gray-500" />
      <span className="w-16 text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}


// Komponen utama NotificationCard
export default function NotificationCard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/reported`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setReports(data.groups || []);
        } else {
          setError('Gagal mengambil data notifikasi');
        }
      } catch (e) {
        setError('Terjadi kesalahan saat fetch');
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const handleNext = () => {
    setActiveIdx((prev) => (prev < reports.length - 1 ? prev + 1 : prev));
  };

  const current = reports[activeIdx];

  return (
    <div className="flex h-full flex-col rounded-lg bg-white p-5 border border-gray-300">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Report Notification</h3>
      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : !current ? (
          <p className="text-gray-500">Tidak ada laporan</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-800">Report {activeIdx + 1} {reports.length > 1 && `/ ${reports.length}`}</p>
              {reports.length > 1 && (
                <div className="flex gap-2">
                  <button onClick={handlePrev} disabled={activeIdx === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={handleNext} disabled={activeIdx === reports.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <DetailRow icon={Calendar} label="Date" value={current.reportIssue?.reportedAt ? new Date(current.reportIssue.reportedAt).toLocaleDateString() : '-'} />
            <DetailRow icon={Users} label="Tim" value={current.namaTim ?? '-'} />
            <div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Alasan</span>
              </div>
              <p className="mt-1 pl-6 text-sm font-medium text-red-600">
                {current.reportIssue?.description ?? '-'}
              </p>
            </div>
          </>
        )}
      </div>
      <div className="mt-auto pt-4 text-right">
        <button className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          Done
        </button>
      </div>
    </div>
  );
}
