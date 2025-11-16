import { Search, ChevronDown, ExternalLink } from 'react-feather';

function CapstoneProjectTable() {
  // Data ini idealnya berasal dari API
  const project = [
    { id: 1, tema: 'Pengolahan Sampah', namaTim: 'F04', judul: 'SmartWaste: IoT-Based Waste Management System for Urban Areas', status: 'Available' },
    { id: 2, tema: 'Pengolahan Sampah', namaTim: 'F04', judul: 'SmartWaste: IoT-Based Waste Management System for Urban Areas', status: 'Not Available' },
    { id: 3, tema: 'Pengolahan Sampah', namaTim: 'F04', judul: 'SmartWaste: IoT-Based Waste Management System for Urban Areas', status: 'Available' },
  ];

  return (
    <section className="mt-8"> {/* Memberi jarak dari kartu statistik di atas */}
      
      {/* 1. Header Bagian */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Capstone Project Overview
        </h2>
        <ExternalLink className="h-5 w-5 cursor-pointer text-gray-500" /> {/* Diganti */}
      </div>

      {/* 2. Toolbar (Filter & Search) */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Categorization
          <ChevronDown className="h-4 w-4" /> {/* Diganti */}
        </button>
        <button className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Filters
          <ChevronDown className="h-4 w-4" /> {/* Diganti */}
        </button>
        
        {/* Search Input - di paling kanan */}
        <div className="relative ml-auto">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" /> {/* Diganti */}
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 3. Tabel */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto"> {/* Membuat tabel responsif secara horizontal */}
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Head */}
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tema</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama Tim</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Judul</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {project.map((project) => (
                <tr key={project.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{project.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{project.tema}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{project.namaTim}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{project.judul}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{project.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CapstoneProjectTable;