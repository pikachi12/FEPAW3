// Import ikon-ikon yang relevan
import { Calendar, Users, AlertCircle, type Icon as FeatherIcon } from 'react-feather';

interface DetailRowProps {
  icon: FeatherIcon; // Tipe 'icon' adalah komponen React dari feather
  label: string;
  value: string | number; // 'value' bisa string atau angka
}

// Sub-komponen untuk baris detail
function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-gray-500" />
      <span className="w-16 text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}

export default function NotificationCard() {
  return (
    <div className="flex h-full flex-col rounded-lg bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        Report Notification
      </h3>
      
      <div className="space-y-3">
        {/* Laporan */}
        <p className="text-sm font-medium text-gray-800">Report 1</p>
        
        {/* Detail Laporan */}
        <DetailRow icon={Calendar} label="Date" value="21/03/2025" />
        <DetailRow icon={Users} label="Tim" value="F04" />
        
        {/* Alasan (Layout sedikit berbeda) */}
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Alasan</span>
          </div>
          <p className="mt-1 pl-6 text-sm font-medium text-red-600">
            Jurusan anggota tim bernama Dimas harusnya Teknik Biomedis
          </p>
        </div>
      </div>
      
      {/* Tombol "Done" di bagian bawah */}
      <div className="mt-auto pt-4 text-right"> {/* mt-auto mendorong tombol ke bawah */}
        <button className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          Done
        </button>
      </div>
    </div>
  );
}