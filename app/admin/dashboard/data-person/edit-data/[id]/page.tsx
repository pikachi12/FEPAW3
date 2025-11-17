// app/admin/dashboard/data-person/edit-data/[id]/page.tsx
import EditPersonClient from "./EditPersonClient";

export default async function EditDataPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-xl font-bold">Edit Data Person</h1>

      {/* 🔥 Tambahkan card wrapper di bawah ini */}
      <div className="max-w-3xl bg-white border p-6 mt-4 rounded-lg shadow">
        <EditPersonClient 
          personId={id}
        />
      </div>
    </div>
  );
}