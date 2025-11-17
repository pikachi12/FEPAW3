interface PaginationProps {
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export default function Pagination({ total, page, rowsPerPage, onPageChange, onRowsPerPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / rowsPerPage);
  return (
    <section className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center py-8 gap-4">
      <p className="text-gray-600 text-sm">
        Showing {(page - 1) * rowsPerPage + 1}
        –{Math.min(page * rowsPerPage, total)} from {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="border rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          «
        </button>
        <span className="text-sm text-gray-700">{page} of {totalPages}</span>
        <button
          className="border rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          »
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <select
          className="border rounded-md px-2 py-1 text-sm"
          value={rowsPerPage}
          onChange={e => onRowsPerPageChange(Number(e.target.value))}
        >
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
        </select>
      </div>
    </section>
  );
}
