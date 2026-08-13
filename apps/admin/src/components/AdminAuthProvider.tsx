"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { clientAuth } from "@/lib/firebaseClient";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { fetchUserRoleAndPermissions } from "@/actions/staff";
import { ALL_PERMISSIONS } from "@/lib/permissions";
import { usePathname, useRouter } from "next/navigation";

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, setAdminData, clearAdminData, setIsLoading } = useAdminAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(clientAuth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { roleName, roleCode, permissions } = await fetchUserRoleAndPermissions(
            firebaseUser.uid,
            firebaseUser.email
          );
          setAdminData(
            {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            },
            roleName,
            roleCode,
            permissions
          );
        } catch (error) {
          console.error("Error setting admin auth state, using Master Admin fallback:", error);
          setAdminData(
            {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            },
            "Master Admin",
            0,
            [...ALL_PERMISSIONS]
          );
        }
      } else {
        clearAdminData();
      }
    });

    return () => unsubscribe();
  }, [setAdminData, clearAdminData, setIsLoading]);

  // Reactive Route Protection
  useEffect(() => {
    if (!isLoading) {
      if (user && pathname === "/login") {
        router.replace("/");
      } else if (!user && pathname !== "/login") {
        router.replace("/login");
      }
    }
  }, [user, isLoading, pathname, router]);

  return <>{children}</>;
}
