"use client";

import { useEffect, useState } from "react";
import ProjectForm from "@/app/admin/components/ProjectForm";

export default function EditProjectClient({ projectId }: { projectId: string }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/capstones/${projectId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json.capstone || json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Project not found</div>;
  }

  return <ProjectForm initialData={data} mode="edit" projectId={projectId} />;
}