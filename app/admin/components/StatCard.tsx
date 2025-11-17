interface StatCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  timeframe: string;
}

/**
 * Komponen StatCard
 *
 * @param {string} title - Judul kartu (misal: "Pending", "Approval")
 * @param {string} subtitle - Deskripsi di bawah judul (misal: "Including all registered data")
 * @param {string|number} value - Angka statistik utama (misal: "2", "40")
 * @param {string} timeframe - Teks di bawah angka (misal: "Since last month")
 */

function StatCard({ title, subtitle, value, timeframe }: StatCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-300 bg-white p-5">
      {/* Bagian Judul */}
      <span className="text-sm font-semibold text-gray-700">{title}</span>
      <span className="mb-4 text-xs text-gray-500">{subtitle}</span>

      {/* Bagian Nilai (Value) */}
      <p className="text-4xl font-bold text-gray-900">{value}</p>
      <span className="mt-1 text-sm text-gray-500">{timeframe}</span>
    </div>
  );
}

export default StatCard;