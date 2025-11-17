"use client";
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import NotificationCard from './components/NotificationCard';
import CapstoneTeamsTable from './components/CapstoneTeamsTable';
import CapstoneProjectsTable from './components/CapstoneProjectTable';
import useSWR from 'swr';

// 1. Buat fungsi fetcher reusable di luar komponen
// Penting: credentials: 'include' agar cookies/auth terbawa
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Terjadi kesalahan saat mengambil data');
  }

  return res.json();
};

export default function DashboardPage() {
  // 2. Gunakan useSWR untuk Capstone Stats
  // SWR otomatis menangani loading, error, dan retry
  const { 
    data: capstoneData, 
    error: capstoneError, 
    isLoading: capstoneLoading 
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/capstones/stats`, fetcher);

  // 3. Gunakan useSWR untuk Group Stats
  const { 
    data: groupData, 
    error: groupError, 
    isLoading: groupLoading 
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/stats`, fetcher);

  // 4. Siapkan data default (Fallback) agar tidak error saat undefined/loading
  // Jika capstoneData ada pakai itu, jika tidak pakai object kosong/nilai 0
  const stats = capstoneData || {
    tersedia: 0,
    fullyRequested: 0,
    unavailableBecauseApproved: 0,
  };

  const groupStatus = {
    pending: groupData?.requestStatus?.pending ?? 0,
    approved: groupData?.requestStatus?.approved ?? 0,
    rejected: groupData?.requestStatus?.rejected ?? 0,
  };

  // Gabungkan state loading dan error untuk UI
  const isLoading = capstoneLoading || groupLoading;
  const isError = capstoneError || groupError;

  // Definisi Cards
  const groupStatusCards = [
    {
      title: 'Pending',
      subtitle: 'Including all registered data',
      value: groupStatus.pending,
      timeframe: 'Current data',
    },
    {
      title: 'Approval',
      subtitle: 'Including all registered data',
      value: groupStatus.approved,
      timeframe: 'Current data',
    },
    {
      title: 'Declined',
      subtitle: 'Including all registered data',
      value: groupStatus.rejected,
      timeframe: 'Current data',
    },
  ];

  const capstoneStatusCards = [
    {
      title: 'Available',
      subtitle: 'Including all registered data',
      value: stats.tersedia,
      timeframe: 'Current data',
    },
    {
      title: 'Not Available, Limit',
      subtitle: 'Including all registered data',
      value: stats.fullyRequested,
      timeframe: 'Current data',
    },
    {
      title: 'Not Available, Matched',
      subtitle: 'Including all registered data',
      value: stats.unavailableBecauseApproved,
      timeframe: 'Current data',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="mb-3 text-2xl font-semibold text-gray-800">Dashboard</h1>
        
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-6">
            
            {/* Tampilkan Pesan Error jika ada, SWR akan tetap mencoba retry di background */}
            {isError && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
                Gagal memuat data. Sedang mencoba menghubungkan kembali...
              </div>
            )}

            {/* Row Atas: Group Status Overview */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Group Status Overview</h2>
              {isLoading ? (
                 // Skeleton Loading Sederhana
                 <div className="mt-4 h-32 w-full bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {groupStatusCards.map((card, idx) => (
                    <StatCard key={idx} {...card} />
                  ))}
                </div>
              )}
            </div>

            {/* Row Bawah: Capstones Status Overview */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Capstones Status Overview</h2>
              {isLoading ? (
                 <div className="mt-4 h-32 w-full bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {capstoneStatusCards.map((card, idx) => (
                    <StatCard key={idx} {...card} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/3 xl:w-1/4">
            <NotificationCard />
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {/* Note: Jika tabel ini butuh fetch data juga, sebaiknya gunakan SWR di dalamnya juga */}
          <CapstoneTeamsTable />
          <CapstoneProjectsTable />
        </div>
      </main>
    </div>
  );
}