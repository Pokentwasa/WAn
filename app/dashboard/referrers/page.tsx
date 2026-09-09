"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";
import { getReferrerStats } from "@/lib/services/referralService";
import { getRewardSummaryForReferrer } from "@/lib/services/rewardService";
import { ReferrerCard } from "@/components/referrers/referrer-card";
import { AddReferrerSheet } from "@/components/referrers/add-referrer-sheet";
import { RequestPaymentSheet } from "@/components/payments/request-payment-sheet";

function ReferrersContent() {
  const searchParams = useSearchParams();
  const { state } = useAppData();
  const [addOpen, setAddOpen] = useState(searchParams.get("add") === "1");
  const [paymentReferrerId, setPaymentReferrerId] = useState<string | null>(null);

  const referrersWithStats = useMemo(
    () =>
      state.referrers.map((referrer) => ({
        referrer,
        stats: getReferrerStats(
          referrer,
          state.clicksByReferrer[referrer.id] ?? 0,
          state.referralSales,
          state.rewards
        ),
        rewardSummary: getRewardSummaryForReferrer(referrer.id, state.rewards),
      })),
    [state]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Referrers</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {state.referrers.length} people sharing your business right now.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Add referrer
        </Button>
      </div>

      {referrersWithStats.length === 0 ? (
        <div className="rounded-md border border-dashed border-border-strong py-16 text-center">
          <p className="text-sm text-ink-muted">
            No referrers yet. Add your first one to get a shareable link.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {referrersWithStats.map(({ referrer, stats, rewardSummary }) => (
            <ReferrerCard
              key={referrer.id}
              referrer={referrer}
              stats={stats}
              rewardSummary={rewardSummary}
              onRequestPayment={() => setPaymentReferrerId(referrer.id)}
            />
          ))}
        </div>
      )}

      <AddReferrerSheet open={addOpen} onOpenChange={setAddOpen} />
      <RequestPaymentSheet
        open={paymentReferrerId !== null}
        onOpenChange={(open) => !open && setPaymentReferrerId(null)}
        defaultReferrerId={paymentReferrerId}
      />
    </div>
  );
}

export default function ReferrersPage() {
  return (
    <Suspense fallback={null}>
      <ReferrersContent />
    </Suspense>
  );
}
