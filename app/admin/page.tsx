"use client";
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import NotificationCard from './components/NotificationCard';
import CapstoneTeamsTable from './components/CapstoneTeamsTable';
import CapstoneProjectsTable from './components/CapstoneProjectTable';
import { useEffect, useState } from 'react';

// Ini adalah Server Component secara default.
// Data bisa di-fetch di sini dan dilewatkan sebagai props.
export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCapstones: 0,
    tersedia: 0,
    tidakTersedia: 0,
    fullyRequested: 0,
    noRequests: 0,
    partiallyRequested: 0,
    unavailableBecauseApproved: 0,
  });
  const [groupStatus, setGroupStatus] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Fetch capstone stats
    const fetchCapstoneStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/capstones/stats`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setError((prev) => (prev ? prev + '\n' : '') + 'Gagal mengambil data statistik capstone');
        }
      } catch (e) {
        if (isMounted) setError((prev) => (prev ? prev + '\n' : '') + 'Terjadi kesalahan saat fetch capstone');
      }
    };

    // Fetch group stats
    const fetchGroupStats = async () => {
      try {
        const resGroup = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/stats`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!isMounted) return;
        if (resGroup.ok) {
          const dataGroup = await resGroup.json();
          setGroupStatus({
            pending: dataGroup.requestStatus?.pending ?? 0,
            approved: dataGroup.requestStatus?.approved ?? 0,
            rejected: dataGroup.requestStatus?.rejected ?? 0,
          });
        } else {
          setError((prev) => (prev ? prev + '\n' : '') + 'Gagal mengambil data statistik group');
        }
      } catch (e) {
        if (isMounted) setError((prev) => (prev ? prev + '\n' : '') + 'Terjadi kesalahan saat fetch group');
      }
    };

    Promise.all([fetchCapstoneStats(), fetchGroupStats()]).finally(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  // Group Status Overview
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

  // Capstones Status Overview
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
            {/* Row Atas: Group Status Overview */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Group Status Overview</h2>
              {loading ? (
                <p className="text-gray-500">Memuat data statistik...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {groupStatusCards.map((card, idx) => (
                    <StatCard
                      key={idx}
                      title={card.title}
                      subtitle={card.subtitle}
                      value={card.value}
                      timeframe={card.timeframe}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Row Bawah: Capstones Status Overview */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Capstones Status Overview</h2>
              {loading ? (
                <p className="text-gray-500">Memuat data statistik...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {capstoneStatusCards.map((card, idx) => (
                    <StatCard
                      key={idx}
                      title={card.title}
                      subtitle={card.subtitle}
                      value={card.value}
                      timeframe={card.timeframe}
                    />
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
          <CapstoneTeamsTable />
          <CapstoneProjectsTable/>
        </div>
      </main>
    </div>
  );
}