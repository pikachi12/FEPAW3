import EditGroupClient from "./EditGroupClient";

export default async function EditTeamPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params; // ✅ Ganti use() jadi await

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Team</h1>
      <EditGroupClient groupId={id} />
    </div>
  );
}