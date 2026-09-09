"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from "@/components/ui/sheet";
import { useAppData } from "@/lib/store";
import { getCampaignStats } from "@/lib/services/campaignService";
import { formatDate, formatRand } from "@/lib/utils";
import type { CampaignStatus, RewardType } from "@/lib/types";

const STATUS_CONFIG: Record<CampaignStatus, { label: string; variant: "money" | "neutral" }> = {
  active: { label: "Active", variant: "money" },
  paused: { label: "Paused", variant: "neutral" },
  ended: { label: "Ended", variant: "neutral" },
};

export default function CampaignsPage() {
  const { state, addCampaign } = useAppData();
  const [createOpen, setCreateOpen] = useState(false);

  const [name, setName] = useState("");
  const [rewardType, setRewardType] = useState<RewardType>("percentage");
  const [rewardValue, setRewardValue] = useState("10");
  const [discountValue, setDiscountValue] = useState("5");
  const [submitting, setSubmitting] = useState(false);

  const campaigns = useMemo(
    () =>
      [...state.campaigns]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((c) => ({ campaign: c, stats: getCampaignStats(c, state.referralSales) })),
    [state.campaigns, state.referralSales]
  );

  async function handleCreate() {
    setSubmitting(true);
    await addCampaign({
      name,
      rewardType,
      rewardValue: Number(rewardValue),
      customerDiscountPercent: discountValue ? Number(discountValue) : null,
    });
    setSubmitting(false);
    setCreateOpen(false);
    setName("");
    setRewardValue("10");
    setDiscountValue("5");
  }

  const canCreate = name.trim().length > 1 && Number(rewardValue) > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Campaigns</h1>
          <p className="mt-1 text-sm text-ink-muted">Group referrals under a reward and discount.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {campaigns.map(({ campaign, stats }) => {
          const status = STATUS_CONFIG[campaign.status];
          return (
            <Card key={campaign.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{campaign.name}</p>
                  <p className="mt-0.5 text-[13px] text-ink-muted">
                    Started {formatDate(campaign.createdAt)}
                  </p>
                </div>
                <Badge variant={status.variant} dot>
                  {status.label}
                </Badge>
              </div>

              <div className="mt-3 flex gap-4 text-[13px] text-ink-muted">
                <span>
                  {campaign.rewardType === "percentage"
                    ? `${campaign.rewardValue}% reward`
                    : `${formatRand(campaign.rewardValue)} reward`}
                </span>
                {campaign.customerDiscountPercent && (
                  <span>{campaign.customerDiscountPercent}% customer discount</span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 rounded-sm bg-paper p-3 text-center">
                <div>
                  <p className="font-medium text-ink tabular">{stats.referrerCount}</p>
                  <p className="mt-0.5 text-[11.5px] text-ink-muted">Referrers</p>
                </div>
                <div>
                  <p className="font-medium text-ink tabular">{stats.saleCount}</p>
                  <p className="mt-0.5 text-[11.5px] text-ink-muted">Sales</p>
                </div>
                <div>
                  <p className="font-medium text-ink tabular">{formatRand(stats.revenue)}</p>
                  <p className="mt-0.5 text-[11.5px] text-ink-muted">Revenue</p>
                </div>
                <div>
                  <p className="font-medium text-brand-text tabular">
                    {formatRand(stats.rewardCost)}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-ink-muted">Reward cost</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New campaign</SheetTitle>
            <SheetDescription>Takes less than a minute - you can change this later.</SheetDescription>
          </SheetHeader>
          <SheetBody className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="camp-name">Name</Label>
              <Input
                id="camp-name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="September Cake Referrals"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Reward</Label>
              <div className="flex rounded-sm bg-black/5 p-1">
                {(["percentage", "fixed"] as RewardType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setRewardType(t)}
                    className={`flex-1 rounded-[6px] py-2 text-sm font-medium transition-colors ${
                      rewardType === t ? "bg-white text-ink shadow-card" : "text-ink-muted"
                    }`}
                  >
                    {t === "percentage" ? "Percentage" : "Fixed"}
                  </button>
                ))}
              </div>
              <Input
                inputMode="decimal"
                value={rewardValue}
                onChange={(e) => setRewardValue(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder={rewardType === "percentage" ? "10" : "100"}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Customer discount (optional)</Label>
              <Input
                inputMode="decimal"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="5"
              />
            </div>
          </SheetBody>
          <SheetFooter>
            <Button
              size="lg"
              className="w-full sm:w-auto"
              disabled={!canCreate || submitting}
              onClick={handleCreate}
            >
              {submitting ? "Creating..." : "Create campaign"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
