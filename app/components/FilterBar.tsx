import { ChevronDown } from "react-feather";
import { useState, useRef, useEffect } from "react";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;

  sortBy: string;
  setSortBy: (value: string) => void;

  order: string;
  setOrder: (value: string) => void;

  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
}

export default function FilterBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  order,
  setOrder,
  selectedStatus,
  setSelectedStatus,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 mt-8 mb-6">

      {/* Banner */}
      <div className="w-full rounded-lg px-4 py-3 mb-4" style={{ background: "#FFF4EB" }}>
        <p className="text-sm text-orange-700 font-medium text-center">
          Make a request to get matched with past capstone projects relevant to your team
        </p>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 relative">

        {/* CATEGORY DROPDOWN */}
        <div className="relative">
          <select
            className="border rounded-md px-3 py-2 pr-8 appearance-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
            <ChevronDown size={18} />
          </span>
        </div>

        {/* FILTER BUTTON */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="border rounded-md px-3 py-2 flex items-center gap-1 hover:bg-gray-100"
          >
            Filters
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {/* DROPDOWN APPEARS HERE */}
          <div
            className={`absolute right-0 mt-2 w-72 sm:w-60 bg-white border rounded-lg shadow-lg p-4 z-20 overflow-x-auto transition-all duration-300 ease-in-out
              ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
            style={{ transformOrigin: 'top right' }}
          >
            {/* SORT BY */}
            <p className="text-sm font-semibold text-gray-700 mb-1">Sort By</p>
            <select
              className="w-full border px-2 py-1 rounded-md text-sm mb-3"
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [field, ord] = e.target.value.split("-");
                setSortBy(field);
                setOrder(ord);
              }}
            >
              <option value="createdAt-desc">Terbaru</option>
              <option value="createdAt-asc">Terlama</option>
              <option value="judul-asc">Judul A - Z</option>
              <option value="judul-desc">Judul Z - A</option>
            </select>

            {/* STATUS FILTER */}
            <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
            <select
              className="w-full border px-2 py-1 rounded-md text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Tersedia">Available</option>
              <option value="Tidak Tersedia">Not Available</option>
            </select>

          </div>
        </div>

      </div>
    </section>
  );
}
