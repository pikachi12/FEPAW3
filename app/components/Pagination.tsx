export default function Pagination() {
  return (
    <section className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center py-8 gap-4">
      <p className="text-gray-600 text-sm">Showing 1–12 from 48</p>
      <div className="flex items-center gap-2">
        <button className="border rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100">
          «
        </button>
        <span className="text-sm text-gray-700">1 of 4</span>
        <button className="border rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100">
          »
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <select className="border rounded-md px-2 py-1 text-sm">
          <option>4</option>
          <option>8</option>
          <option>12</option>
        </select>
      </div>
    </section>
  );
}
