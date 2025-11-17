import ProjectForm from "@/app/admin/components/ProjectForm";

export default function AddProjectPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Add New Project</h1>
      <ProjectForm mode="add" />
    </div>
  );
}