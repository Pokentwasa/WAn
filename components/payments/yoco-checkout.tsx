"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Wallet, CheckCircle2, XCircle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";
import { formatRand } from "@/lib/utils";
import type { PaymentMethod, PaymentRequest, ReferralSale } from "@/lib/types";

const METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: "card", label: "Card", icon: <CreditCard className="h-5 w-5" /> },
  { value: "apple_pay", label: "Apple Pay", icon: <Smartphone className="h-5 w-5" /> },
  { value: "google_pay", label: "Google Pay", icon: <Wallet className="h-5 w-5" /> },
];

type Stage = "select" | "processing" | "success" | "failed";

export function YocoCheckout({ paymentRequest }: { paymentRequest: PaymentRequest }) {
  const { state, completePayment } = useAppData();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [stage, setStage] = useState<Stage>(
    paymentRequest.status === "paid" ? "success" : "select"
  );
  const [sale, setSale] = useState<ReferralSale | null>(
    () => state.referralSales.find((s) => s.paymentRequestId === paymentRequest.id) ?? null
  );

  const merchant = state.merchant;
  if (!merchant) return null;

  async function handlePay(outcome: "succeeded" | "failed") {
    setStage("processing");
    const result = await completePayment(paymentRequest.id, method, outcome);
    if (result.success) {
      setSale(result.sale);
      setStage("success");
    } else {
      setStage("failed");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col px-6 py-10">
        <div className="text-center">
          <p className="text-[13px] font-medium uppercase tracking-wide text-ink-faint">
            {merchant.businessName}
          </p>
          <p className="mt-2 text-[15px] text-ink-muted">{paymentRequest.description}</p>
          <p className="mt-1 font-display text-[40px] font-semibold leading-none text-ink tabular">
            {formatRand(paymentRequest.amount)}
          </p>
        </div>

        <div className="mt-10 flex-1">
          {stage === "select" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex flex-col gap-2.5">
                {METHODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMethod(m.value)}
                    className={`flex items-center gap-3 rounded-md border p-4 text-left transition-colors ${
                      method === m.value
                        ? "border-brand bg-brand-tint"
                        : "border-border-strong bg-white hover:border-ink-faint"
                    }`}
                  >
                    <span className={method === m.value ? "text-brand-text" : "text-ink-muted"}>
                      {m.icon}
                    </span>
                    <span className="text-sm font-medium text-ink">{m.label}</span>
                  </button>
                ))}
              </div>

              <Button size="lg" onClick={() => handlePay("succeeded")}>
                Pay {formatRand(paymentRequest.amount)}
              </Button>

              <button
                onClick={() => handlePay("failed")}
                className="text-center text-[13px] text-ink-faint underline-offset-2 hover:underline"
              >
                Simulate a failed payment instead
              </button>
            </div>
          )}

          {stage === "processing" && (
            <div className="flex flex-col items-center pt-10 animate-fade-in">
              <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-border-strong border-t-brand" />
              <p className="mt-5 text-[15px] text-ink-muted">Processing payment&hellip;</p>
            </div>
          )}

          {stage === "success" && (
            <div className="flex flex-col items-center pt-4 text-center animate-pop">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-money-tint">
                <CheckCircle2 className="h-7 w-7 text-money" strokeWidth={2.5} />
              </div>
              <p className="mt-4 text-lg font-medium text-ink">Payment successful</p>
              <p className="mt-1 text-[13px] text-ink-faint">Powered by Yoco</p>

              {sale && sale.referrerId && (
                <div className="mt-6 w-full rounded-md border border-border bg-white p-5 text-left">
                  <div className="flex items-center gap-2">
                    <PartyPopper className="h-4 w-4 text-brand-text" />
                    <p className="text-sm font-medium text-ink">Referral sale confirmed</p>
                  </div>
                  <p className="mt-2.5 text-sm text-ink-muted">
                    <span className="font-medium text-ink">{sale.referrerName}</span> earned{" "}
                    <span className="font-medium text-brand-text">
                      {formatRand(sale.rewardAmount)}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {merchant.businessName} generated{" "}
                    <span className="font-medium text-money-text">
                      {formatRand(sale.amount)}
                    </span>{" "}
                    in referral revenue
                  </p>
                </div>
              )}
            </div>
          )}

          {stage === "failed" && (
            <div className="flex flex-col items-center pt-4 text-center animate-pop">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-tint">
                <XCircle className="h-7 w-7 text-clay" strokeWidth={2.5} />
              </div>
              <p className="mt-4 text-lg font-medium text-ink">Payment failed</p>
              <p className="mt-1 text-[13px] text-ink-muted">The card was declined. No charge was made.</p>
              <Button className="mt-6 w-full" onClick={() => setStage("select")}>
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
