"use client";

import { useEffect, useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppData } from "@/lib/store";
import { formatSAPhoneInput } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/services/merchantService";
import type { BusinessCategory, RewardType } from "@/lib/types";

export default function SettingsPage() {
  const { state, updateMerchantSettings, resetDemo } = useAppData();
  const merchant = state.merchant;

  const [businessName, setBusinessName] = useState(merchant?.businessName ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(merchant?.whatsappNumber ?? "");
  const [category, setCategory] = useState<BusinessCategory>(merchant?.category ?? "other");
  const [rewardType, setRewardType] = useState<RewardType>(merchant?.rewardType ?? "percentage");
  const [rewardValue, setRewardValue] = useState(String(merchant?.rewardValue ?? 10));
  const [discountEnabled, setDiscountEnabled] = useState(
    merchant?.customerDiscountPercent != null
  );
  const [discountValue, setDiscountValue] = useState(
    String(merchant?.customerDiscountPercent ?? 5)
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!merchant) return;
    setBusinessName(merchant.businessName);
    setWhatsappNumber(merchant.whatsappNumber);
    setCategory(merchant.category);
    setRewardType(merchant.rewardType);
    setRewardValue(String(merchant.rewardValue));
    setDiscountEnabled(merchant.customerDiscountPercent != null);
    setDiscountValue(String(merchant.customerDiscountPercent ?? 5));
  }, [merchant]);

  if (!merchant) return null;

  function handleSave() {
    updateMerchantSettings({
      businessName,
      whatsappNumber,
      category,
      rewardType,
      rewardValue: Number(rewardValue) || 0,
      customerDiscountPercent: discountEnabled ? Number(discountValue) || 0 : null,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">
          You only pay when referrals sell - {merchant.platformFeePercent}% on successful
          referred sales, no setup fee, no monthly fee.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="settings-name">Business name</Label>
            <Input
              id="settings-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="settings-whatsapp">WhatsApp number</Label>
            <Input
              id="settings-whatsapp"
              inputMode="numeric"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(formatSAPhoneInput(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>What you sell</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as BusinessCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral reward</CardTitle>
          <CardDescription>What a referrer earns on every sale they bring in.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          <div className="flex rounded-sm bg-black/5 p-1">
            {(["percentage", "fixed"] as RewardType[]).map((t) => (
              <button
                key={t}
                onClick={() => setRewardType(t)}
                className={`flex-1 rounded-[6px] py-2 text-sm font-medium transition-colors ${
                  rewardType === t ? "bg-white text-ink shadow-card" : "text-ink-muted"
                }`}
              >
                {t === "percentage" ? "Percentage" : "Fixed amount"}
              </button>
            ))}
          </div>
          <Input
            inputMode="decimal"
            value={rewardValue}
            onChange={(e) => setRewardValue(e.target.value.replace(/[^0-9.]/g, ""))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer discount</CardTitle>
          <CardDescription>Optional incentive shown to referred customers.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          <button
            onClick={() => setDiscountEnabled((v) => !v)}
            className={`flex items-center justify-between rounded-md border p-4 transition-colors ${
              discountEnabled ? "border-brand bg-brand-tint" : "border-border-strong bg-white"
            }`}
          >
            <span className="text-sm font-medium text-ink">Give referred customers a discount</span>
            <span
              className={`flex h-6 w-10 items-center rounded-full p-0.5 transition-colors ${
                discountEnabled ? "bg-brand justify-end" : "bg-black/15 justify-start"
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-white shadow" />
            </span>
          </button>
          {discountEnabled && (
            <Input
              inputMode="decimal"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value.replace(/[^0-9.]/g, ""))}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment integration</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between rounded-md border border-border-strong p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-money-tint">
                <CreditCard className="h-4 w-4 text-money" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Yoco</p>
                <p className="text-[13px] text-ink-muted">Demo connected</p>
              </div>
            </div>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-money-tint">
              <Check className="h-3.5 w-3.5 text-money" />
            </span>
          </div>
          <p className="mt-2 text-[13px] text-ink-faint">
            This is a demo connection for the prototype. A real integration will use Yoco&apos;s
            OAuth flow here.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button size="lg" onClick={handleSave}>
          {saved ? "Saved" : "Save changes"}
        </Button>
        {saved && <span className="text-[13px] text-money-text">Settings updated</span>}
      </div>

      <Card className="border-clay/30">
        <CardHeader>
          <CardTitle>Demo data</CardTitle>
          <CardDescription>Reset everything back to the seeded example data.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Button variant="destructive" onClick={resetDemo}>
            Reset demo data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
