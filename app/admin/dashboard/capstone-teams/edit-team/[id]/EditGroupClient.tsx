"use client";

import { useEffect, useState } from "react";
import TeamForm from "@/app/admin/components/TeamForm";

interface EditGroupClientProps {
  groupId: string;
}

export default function EditGroupClient({ groupId }: EditGroupClientProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/groups/${groupId}`,
          {
            credentials: "include", // ✅ Otomatis bawa cookie dari browser
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const json = await res.json();
        const groupData = json.group || json;
        
        setData(groupData);
      } catch (err) {
        console.error("Error fetching group:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="h-20 w-full animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 underline hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-yellow-800">Group not found</p>
      </div>
    );
  }

  return <TeamForm mode="edit" groupId={groupId} initialData={data} />;
}