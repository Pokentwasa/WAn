"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { useAppData } from "@/lib/store";

export function SidebarNav() {
  const pathname = usePathname();
  const { state } = useAppData();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-brand text-sm font-semibold text-white">
          {state.merchant?.businessName.charAt(0) ?? "R"}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">
            {state.merchant?.businessName ?? "Your business"}
          </p>
          <p className="text-xs text-ink-muted">Referral programme</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-tint text-brand-text"
                  : "text-ink-muted hover:bg-black/5 hover:text-ink"
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-md bg-paper p-3.5">
        <p className="text-[13px] font-medium text-ink">You only pay when referrals sell.</p>
        <p className="mt-1 text-[13px] text-ink-muted">
          {state.merchant?.platformFeePercent ?? 5}% on successful referred sales. No monthly fee.
        </p>
      </div>
    </aside>
  );
}
