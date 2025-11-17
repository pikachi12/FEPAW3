// app/admin/dashboard/data-person/edit-data/[id]/EditPersonClient.tsx
"use client";

import { useEffect, useState } from "react";
import PersonForm from "../../../../components/PersonForm";

export default function EditPersonClient({ personId }: { personId: string }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${personId}`, {
      credentials: "include", // ✅ ini akan otomatis bawa cookie dari browser
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [personId]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Data not found</div>;

  return <PersonForm initialData={data} mode="edit" personId={personId} />;
}