import { Filter } from "react-feather";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

export default function FilterBar({
  categories,
  selectedCategory,
  setSelectedCategory,
}: FilterBarProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 flex flex-col gap-3 mt-8 mb-6">
      <div className="w-full rounded-lg px-4 py-3 mb-2" style={{ background: '#FFF4EB' }}>
        <p className="text-sm text-orange-700 font-medium text-center">
          Make a request to get matched with past capstone projects relevant to your team
        </p>
      </div>
      <div className="flex gap-2">
        <select
          className="border rounded-md px-3 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button className="border rounded-md px-3 py-2 flex items-center gap-1 hover:bg-gray-100">
          Filters <Filter size={18} className="text-gray-400" />
        </button>
      </div>
    </section>
  );
}
