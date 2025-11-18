import PersonForm from "../../../components/PersonForm";

export default function AddDataPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Add Data Person</h1>

      <div className="max-w-3xl bg-white border p-6 mt-4 rounded-lg">
        <PersonForm 
          mode="add"
        />
      </div>
    </div>
  );
}
