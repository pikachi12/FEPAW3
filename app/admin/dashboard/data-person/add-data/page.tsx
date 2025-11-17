import PersonForm from "../../../components/PersonForm";

export default function AddDataPage() {
  return (
    <div>
      <h1 className="text-xl font-bold">Add Data Person</h1>

      <div className="max-w-3xl bg-white border p-6 mt-4 rounded-lg shadow">
        <PersonForm 
          mode="add"
        />
      </div>
    </div>
  );
}
