"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/store";

export default function RootPage() {
  const router = useRouter();
  const { state, isHydrated } = useAppData();

  useEffect(() => {
    if (!isHydrated) return;
    if (state.merchant?.onboardingComplete) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [isHydrated, state.merchant, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="h-8 w-8 animate-pulse rounded-full bg-brand-tint" />
    </div>
  );
}
