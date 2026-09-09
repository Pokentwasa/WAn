"use client";

import { useMemo, useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/lib/store";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { SalesChart, type SalesChartPoint } from "@/components/dashboard/sales-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { getReferrerStats } from "@/lib/services/referralService";
import { totalOutstanding } from "@/lib/services/rewardService";
import { RequestPaymentSheet } from "@/components/payments/request-payment-sheet";
import { AddReferrerSheet } from "@/components/referrers/add-referrer-sheet";

export default function OverviewPage() {
  const { state } = useAppData();
  const [requestOpen, setRequestOpen] = useState(false);
  const [addReferrerOpen, setAddReferrerOpen] = useState(false);

  const stats = useMemo(() => {
    const referralSales = state.referralSales
      .filter((s) => s.status === "paid")
      .reduce((sum, s) => sum + s.amount, 0);

    const referrals = state.referrers.reduce((sum, r) => {
      const s = getReferrerStats(r, state.clicksByReferrer[r.id] ?? 0, state.referralSales, state.rewards);
      return sum + s.customers;
    }, 0);

    return {
      referralSales,
      referrals,
      activeReferrers: state.referrers.length,
      rewardsOwed: totalOutstanding(state.rewards),
    };
  }, [state]);

  const chartData: SalesChartPoint[] = useMemo(() => {
    const days = 14;
    const buckets: Record<string, number> = {};
    const order: string[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
      buckets[key] = 0;
      order.push(key);
    }
    state.referralSales
      .filter((s) => s.status === "paid")
      .forEach((s) => {
        const key = new Date(s.createdAt).toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
        });
        if (key in buckets) buckets[key] += s.amount;
      });
    return order.map((label) => ({ label, amount: buckets[label] }));
  }, [state.referralSales]);

  const recentSales = useMemo(
    () =>
      [...state.referralSales]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6),
    [state.referralSales]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Overview</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Word of mouth, now measurable.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="secondary" onClick={() => setAddReferrerOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Add referrer
          </Button>
          <Button onClick={() => setRequestOpen(true)}>
            <Plus className="h-4 w-4" />
            Request payment
          </Button>
        </div>
      </div>

      <SummaryCards {...stats} />

      <Card>
        <CardHeader>
          <CardTitle>Referral sales</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <SalesChart data={chartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent referral activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ActivityFeed sales={recentSales} />
        </CardContent>
      </Card>

      <RequestPaymentSheet open={requestOpen} onOpenChange={setRequestOpen} />
      <AddReferrerSheet open={addReferrerOpen} onOpenChange={setAddReferrerOpen} />
    </div>
  );
}
