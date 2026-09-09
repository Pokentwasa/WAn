"use client";

import { useParams } from "next/navigation";
import { useAppData } from "@/lib/store";
import { YocoCheckout } from "@/components/payments/yoco-checkout";

export default function PayPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { isHydrated, getPaymentRequestById } = useAppData();

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-pulse rounded-full bg-brand-tint" />
      </div>
    );
  }

  const paymentRequest = getPaymentRequestById(id);

  if (!paymentRequest) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
        <p className="font-display text-xl font-semibold text-ink">This payment link isn&apos;t valid</p>
        <p className="mt-2 max-w-xs text-sm text-ink-muted">
          Ask the business to send you a new payment link.
        </p>
      </div>
    );
  }

  return <YocoCheckout paymentRequest={paymentRequest} />;
}
