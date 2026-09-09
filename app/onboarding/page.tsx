"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cake, Sparkles, Shirt, PartyPopper, Camera, Store, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppData } from "@/lib/store";
import { formatSAPhoneInput } from "@/lib/utils";
import type { BusinessCategory, RewardType } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/services/merchantService";

const TOTAL_STEPS = 6;

const CATEGORY_OPTIONS: { value: BusinessCategory; icon: React.ReactNode }[] = [
  { value: "food_baking", icon: <Cake className="h-5 w-5" /> },
  { value: "beauty_hair", icon: <Sparkles className="h-5 w-5" /> },
  { value: "fashion", icon: <Shirt className="h-5 w-5" /> },
  { value: "events", icon: <PartyPopper className="h-5 w-5" /> },
  { value: "photography", icon: <Camera className="h-5 w-5" /> },
  { value: "other", icon: <Store className="h-5 w-5" /> },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useAppData();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [category, setCategory] = useState<BusinessCategory | null>(null);
  const [rewardType, setRewardType] = useState<RewardType>("percentage");
  const [rewardValue, setRewardValue] = useState("10");
  const [discountEnabled, setDiscountEnabled] = useState(true);
  const [discountValue, setDiscountValue] = useState("5");

  const canContinue =
    (step === 1 && businessName.trim().length > 1) ||
    (step === 2 && whatsappNumber.replace(/\D/g, "").length === 10) ||
    (step === 3 && category !== null) ||
    (step === 4 && Number(rewardValue) > 0) ||
    step === 5;

  async function handleFinish() {
    if (!category) return;
    setSubmitting(true);
    await completeOnboarding({
      businessName,
      whatsappNumber,
      category,
      rewardType,
      rewardValue: Number(rewardValue),
      customerDiscountPercent: discountEnabled ? Number(discountValue) : null,
    });
    setSubmitting(false);
    setStep(6);
  }

  function next() {
    if (step === 5) {
      handleFinish();
    } else {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {step < 6 && (
        <div className="mx-auto w-full max-w-md px-6 pt-8">
          <Progress value={(step / 5) * 100} />
        </div>
      )}

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
        {step === 1 && (
          <StepShell
            eyebrow="Let's set up your referral programme"
            title="What's your business called?"
          >
            <Input
              autoFocus
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Sweet by Kay"
              className="text-lg h-14"
              onKeyDown={(e) => e.key === "Enter" && canContinue && next()}
            />
          </StepShell>
        )}

        {step === 2 && (
          <StepShell title="What's your WhatsApp number?" subtitle="This is where customers will land after clicking a referral link.">
            <Input
              autoFocus
              inputMode="numeric"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(formatSAPhoneInput(e.target.value))}
              placeholder="082 555 0101"
              className="text-lg h-14"
              onKeyDown={(e) => e.key === "Enter" && canContinue && next()}
            />
          </StepShell>
        )}

        {step === 3 && (
          <StepShell title="What do you sell?">
            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCategory(opt.value)}
                  className={`flex flex-col items-start gap-3 rounded-md border p-4 text-left transition-colors ${
                    category === opt.value
                      ? "border-brand bg-brand-tint"
                      : "border-border-strong bg-white hover:border-ink-faint"
                  }`}
                >
                  <span
                    className={
                      category === opt.value ? "text-brand-text" : "text-ink-muted"
                    }
                  >
                    {opt.icon}
                  </span>
                  <span className="text-sm font-medium text-ink">
                    {CATEGORY_LABELS[opt.value]}
                  </span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell title="What should referrers earn?" subtitle="Paid automatically out of each sale they bring in.">
            <div className="flex rounded-sm bg-black/5 p-1">
              {(["percentage", "fixed"] as RewardType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setRewardType(t)}
                  className={`flex-1 rounded-[6px] py-2.5 text-sm font-medium transition-colors ${
                    rewardType === t ? "bg-white text-ink shadow-card" : "text-ink-muted"
                  }`}
                >
                  {t === "percentage" ? "Percentage" : "Fixed amount"}
                </button>
              ))}
            </div>
            <div className="relative mt-4">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-ink-muted">
                {rewardType === "fixed" ? "R" : ""}
              </span>
              <Input
                autoFocus
                inputMode="decimal"
                value={rewardValue}
                onChange={(e) => setRewardValue(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder={rewardType === "fixed" ? "100" : "10"}
                className={`text-lg h-14 ${rewardType === "fixed" ? "pl-8" : "pr-8"}`}
              />
              {rewardType === "percentage" && (
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-ink-muted">
                  %
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              {rewardType === "percentage"
                ? `A referrer earns R${((Number(rewardValue) || 0) * 12).toFixed(0)} on a R1,200 sale.`
                : `A referrer earns R${Number(rewardValue) || 0} on every sale, big or small.`}
            </p>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell title="Give referred customers a little extra?" subtitle="Optional - a discount makes people more likely to use the link.">
            <button
              onClick={() => setDiscountEnabled((v) => !v)}
              className={`flex w-full items-center justify-between rounded-md border p-4 transition-colors ${
                discountEnabled ? "border-brand bg-brand-tint" : "border-border-strong bg-white"
              }`}
            >
              <span className="text-sm font-medium text-ink">
                Give referred customers a discount
              </span>
              <span
                className={`flex h-6 w-10 items-center rounded-full p-0.5 transition-colors ${
                  discountEnabled ? "bg-brand justify-end" : "bg-black/15 justify-start"
                }`}
              >
                <span className="h-5 w-5 rounded-full bg-white shadow" />
              </span>
            </button>
            {discountEnabled && (
              <div className="relative mt-3">
                <Input
                  inputMode="decimal"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="5"
                  className="text-lg h-14 pr-8"
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-ink-muted">
                  %
                </span>
              </div>
            )}
            <p className="mt-3 text-sm text-ink-muted">
              {discountEnabled
                ? `Referred customers will see "${discountValue || 0}% off" in the message they send you.`
                : "Referred customers won't be offered a discount."}
            </p>
          </StepShell>
        )}

        {step === 6 && (
          <div className="flex flex-col items-center py-6 text-center animate-pop">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-money-tint">
              <Check className="h-8 w-8 text-money" strokeWidth={2.5} />
            </div>
            <h1 className="mt-6 font-display text-[28px] font-semibold leading-tight text-ink">
              Your referral programme is live
            </h1>
            <p className="mt-2 max-w-xs text-ink-muted">
              {businessName} is ready to turn customers into referrers. Add your
              first referrer to get a shareable link.
            </p>
            <Button
              size="lg"
              className="mt-8 w-full"
              onClick={() => router.push("/dashboard/referrers?add=1")}
            >
              Add your first referrer
            </Button>
            <Button
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => router.push("/dashboard")}
            >
              Go to dashboard
            </Button>
          </div>
        )}
      </div>

      {step < 6 && (
        <div className="mx-auto w-full max-w-md px-6 pb-10">
          <div className="flex gap-2.5">
            {step > 1 && (
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
            )}
            <Button
              size="lg"
              className="flex-[2]"
              disabled={!canContinue || submitting}
              onClick={next}
            >
              {step === 5 ? (submitting ? "Setting up..." : "Create my programme") : "Continue"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in">
      {eyebrow && <p className="mb-2 text-sm text-ink-muted">{eyebrow}</p>}
      <h1 className="font-display text-[26px] font-semibold leading-tight text-ink">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-[15px] text-ink-muted">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
