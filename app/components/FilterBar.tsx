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
    <section className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
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
          Filters ⚙️
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Make a request to get matched with past capstone projects relevant to
        your team
      </p>
    </section>
  );
}
