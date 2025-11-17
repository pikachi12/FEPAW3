import TeamForm from "@/app/admin/components/TeamForm";

export default function AddTeamPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Add Team</h1>

      <TeamForm mode="add" />
    </div>
  );
}