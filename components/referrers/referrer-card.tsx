"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRand, cn } from "@/lib/utils";
import { ShareWhatsAppActions } from "./share-whatsapp-actions";
import type { Referrer } from "@/lib/types";
import type { ReferrerStats } from "@/lib/services/referralService";
import type { RewardSummary } from "@/lib/services/rewardService";

interface ReferrerCardProps {
  referrer: Referrer;
  stats: ReferrerStats;
  rewardSummary: RewardSummary;
  onRequestPayment: () => void;
}

export function ReferrerCard({
  referrer,
  stats,
  rewardSummary,
  onRequestPayment,
}: ReferrerCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{referrer.name}</p>
          <p className="mt-0.5 text-[13px] text-ink-muted">Code: {referrer.code}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={onRequestPayment}>
          <Plus className="h-3.5 w-3.5" />
          Payment
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 rounded-sm bg-paper p-3">
        <Stat label="Clicks" value={stats.clicks.toLocaleString("en-ZA")} />
        <Stat label="Customers" value={stats.customers.toLocaleString("en-ZA")} />
        <Stat label="Sales" value={stats.sales.toLocaleString("en-ZA")} />
        <Stat label="Rewards" value={formatRand(stats.rewardsEarned)} tone="brand" />
      </div>

      <div className="mt-4">
        <ShareWhatsAppActions referrer={referrer} />
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-sm py-2 text-[13px] font-medium text-ink-muted transition-colors hover:bg-black/5 hover:text-ink"
      >
        View performance
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div className="mt-1 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
          <div>
            <p className="text-[13px] text-ink-muted">Revenue generated</p>
            <p className="mt-1 font-medium text-ink tabular">{formatRand(stats.revenue)}</p>
          </div>
          <div>
            <p className="text-[13px] text-ink-muted">Rewards paid</p>
            <p className="mt-1 font-medium text-money-text tabular">
              {formatRand(rewardSummary.paid)}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-ink-muted">Outstanding</p>
            <p className="mt-1 font-medium text-brand-text tabular">
              {formatRand(rewardSummary.outstanding)}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

function Stat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "brand";
}) {
  return (
    <div className="text-center">
      <p className={cn("font-medium tabular", tone === "brand" ? "text-brand-text" : "text-ink")}>
        {value}
      </p>
      <p className="mt-0.5 text-[11.5px] text-ink-muted">{label}</p>
    </div>
  );
}
