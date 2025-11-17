"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getUserRole } from "@/lib/auth";

export default function AutoRedirectHome() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isLoggedIn()) {
      const role = getUserRole();
      if (role) {
        router.replace(`/${role}`);
      }
    }
  }, [router]);

  return null; // tidak render apa-apa
}
