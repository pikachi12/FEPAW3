import EditProjectClient from "./EditProjectClient";

export default async function EditProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Project</h1>
      <EditProjectClient projectId={id} />
    </div>
  );
}