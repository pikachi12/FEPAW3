import { Search, ChevronDown, ExternalLink } from 'react-feather';


import { useEffect, useState } from 'react';

function CapstoneTeamsTable() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    const fetchTeams = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setTeams(data.groups || []);
        } else {
          setError((prev) => (prev ? prev + '\n' : '') + 'Gagal mengambil data tim');
        }
      } catch (e) {
        if (isMounted) setError((prev) => (prev ? prev + '\n' : '') + 'Terjadi kesalahan saat fetch tim');
      }
      if (isMounted) setLoading(false);
    };
    fetchTeams();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Capstone Teams Overview
        </h2>
        <ExternalLink className="h-5 w-5 cursor-pointer text-gray-500" />
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Categorization
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Filters
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="relative" style={{ minWidth: '320px', flex: '1 1 320px' }}>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
            style={{ minWidth: '320px' }}
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tema</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama Tim</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email Ketua</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Memuat data...</td></tr>
              ) : error ? (
                <tr key="error">
                  <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : teams.length === 0 ? (
                <tr key="empty">
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data tim
                  </td>
                </tr>
              ) : (
                teams.slice(0, 3).map((team, idx) => (
                  <tr key={team._id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{team.tema}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{team.namaTim}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{team.ketua?.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{team.ketua?.role ?? ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CapstoneTeamsTable;