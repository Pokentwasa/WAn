"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings } from "lucide-react";
import { useAppData } from "@/lib/store";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { state, isHydrated } = useAppData();

  useEffect(() => {
    if (isHydrated && !state.merchant) {
      router.replace("/onboarding");
    }
  }, [isHydrated, state.merchant, router]);

  if (!isHydrated || !state.merchant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-pulse rounded-full bg-brand-tint" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-3.5 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand text-xs font-semibold text-white">
              {state.merchant.businessName.charAt(0)}
            </div>
            <p className="text-sm font-medium text-ink">{state.merchant.businessName}</p>
          </div>
          <Link
            href="/dashboard/settings"
            className="rounded-sm p-1.5 text-ink-muted hover:bg-black/5"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </header>
        <main className="flex-1 px-5 pb-24 pt-6 lg:px-10 lg:pb-10 lg:pt-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
