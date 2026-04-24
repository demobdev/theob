"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      const role = user?.publicMetadata?.role;
      const isAdminId = user?.id === "user_3CgMcrOXROcFAbLzOX5jxgtCGqq";

      if (role !== "admin" && !isAdminId) {
        router.push("/access-denied");
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFA500]"></div>
      </div>
    );
  }

  // Double check admin status before rendering children
  const role = user?.publicMetadata?.role;
  const isAdminId = user?.id === "user_3CgMcrOXROcFAbLzOX5jxgtCGqq";
  
  if (!isSignedIn || (role !== "admin" && !isAdminId)) {
    return null;
  }

  return <>{children}</>;
}
