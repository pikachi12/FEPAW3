import ProjectForm from "@/app/admin/components/ProjectForm";

export default function AddProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Add New Project</h1>
      <ProjectForm mode="add" />
    </div>
  );
}