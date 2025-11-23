"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (!token) throw new Error("missing token");

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";
        const res = await fetch(`${baseUrl}/api/auth/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("unauthorized");
        if (!cancelled) setAuthorized(true);
      } catch {
        if (!cancelled) {
          setAuthorized(false);
          // Preserve intent: after login return here
          const redirect = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
          router.replace(`/auth/login${redirect}`);
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (checking) {
    return <div style={{ padding: 24 }}>Checking your session…</div>;
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}




























