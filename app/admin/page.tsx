import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import NotificationCard from './components/NotificationCard';
import CapstoneTeamsTable from './components/CapstoneTeamsTable'; // (Versi yang sudah di-update dengan ikon)
import CapstoneProjectsTable from './components/CapstoneProjectTable'; // (Ini akan jadi komponen tabel kedua)

// Ini adalah Server Component secara default.
// Data bisa di-fetch di sini dan dilewatkan sebagai props.
export default async function DashboardPage() {
  
  // --- Simulasi Data Fetching ---
  // Di aplikasi nyata, Anda akan 'await fetch(...)' data di sini
  const projectRequestStats = {
    pending: 2,
    approval: 40,
    declined: 20,
  };
  
  const projectStatusStats = {
    available: 2,
    limit: 60,
    matched: 40,
  };

  // Data untuk tabel-tabel (akan dilewatkan ke komponen tabel)
  // const teamsData = await fetchTeams();
  // const projectsData = await fetchProjects();
  // -----------------------------

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Sidebar (Fixed) */}
      <Sidebar />

      {/* 2. Konten Utama (Bisa di-scroll) */}
      {/* 'ml-64' (margin-left: 16rem) sangat penting 
         karena lebar Sidebar kita adalah 64 (w-64) 
      */}
      <main className="flex-1 ml-64 p-8">
        
        {/* Judul Halaman */}
        <h1 className="mb-3 text-2xl font-semibold text-gray-800">Dashboard</h1>

        {/* ===============================================================
          == MULAI PERUBAHAN BESAR DI SINI ==
          Kita ganti 'grid' dengan 'flex'
        */}
        <div className="flex flex-col gap-6 lg:flex-row">
          
          {/* KOLOM KIRI (Konten Utama) */}
          <div className="flex-1 space-y-6">
            
            {/* Bagian Request Overview */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Project Request Overview
              </h2>
              {/* Grid ini sekarang HANYA untuk 3 kartu ini */}
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard
                  title="Pending"
                  subtitle="Including all registered data"
                  value={projectRequestStats.pending}
                  timeframe="Since last month"
                />
                <StatCard
                  title="Approval"
                  subtitle="Including all registered data"
                  value={projectRequestStats.approval}
                  timeframe="Since last month"
                />
                <StatCard
                  title="Declined"
                  subtitle="Including all registered data"
                  value={projectRequestStats.declined}
                  timeframe="Since last month"
                />
              </div>
            </div>

            {/* Bagian Status Overview */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Project Status Overview
              </h2>
              {/* Grid ini HANYA untuk 3 kartu ini */}
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard
                  title="Available"
                  subtitle="Including all registered data"
                  value={projectStatusStats.available}
                  timeframe="Since last month"
                />
                <StatCard
                  title="Not Available, Limit"
                  subtitle="Including all registered data"
                  value={projectStatusStats.limit}
                  timeframe="Since last month"
                />
                <StatCard
                  title="Not Available, Matched"
                  subtitle="Including all registered data"
                  value={projectStatusStats.matched}
                  timeframe="Since last month"
                />
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (Notifikasi) */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            {/* 'w-full' untuk mobile, 'w-1/4' (25%) atau 'w-1/3' (33%) untuk desktop
                Pilih salah satu (w-1/3 atau w-1/4) yang terlihat pas
            */}
            <NotificationCard />
          </div>

        </div>
        {/* == AKHIR PERUBAHAN BESAR ==
          ===============================================================
        */}

        {/* 3. Area Tabel (di bawah grid kartu) */}
        <div className="mt-8 space-y-8">
          {/* Di sini Anda akan melewatkan 'data={teamsData}'
            yang sudah di-fetch di atas.
          */}
          <CapstoneTeamsTable />

          {/* Anda akan membuat komponen ini (misal: CapstoneProjectsTable)
            yang strukturnya SAMA PERSIS dengan CapstoneTeamsTable,
            hanya berbeda di props 'title', 'columns', dan 'data'
          */}
          <CapstoneProjectsTable/>

          {/* <CapstoneProjectsTable data={projectsData} /> */}
          <p className="text-center text-gray-500">
            {/* Placeholder untuk tabel kedua */}
            (Di sini letak komponen tabel "Capstone Project Overview")
          </p>
        </div>
        
      </main>
    </div>
  );
}