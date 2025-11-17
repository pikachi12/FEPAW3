"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(userStr);

    if (user.role !== "admin") {
      router.replace("/");
      return;
    }

    setAllowed(true);
  }, []);

  if (!allowed) return null; // atau loading screen

  return <>{children}</>;
}
