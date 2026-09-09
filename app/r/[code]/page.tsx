"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";
import { buildCustomerChatMessage } from "@/lib/services/referralService";
import { buildWhatsAppLink } from "@/lib/utils";

export default function ReferralLinkPage() {
  const params = useParams<{ code: string }>();
  const code = Array.isArray(params.code) ? params.code[0] : params.code;
  const { state, isHydrated, getReferrerByCode, recordReferralClick } = useAppData();
  const [ready, setReady] = useState(false);
  const [tracked, setTracked] = useState(false);

  const referrer = isHydrated ? getReferrerByCode(code) : undefined;

  useEffect(() => {
    if (!isHydrated || !referrer) return;
    recordReferralClick(code);
    setTracked(true);
    const t = setTimeout(() => setReady(true), 1100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, referrer?.id]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-pulse rounded-full bg-brand-tint" />
      </div>
    );
  }

  if (!referrer || !state.merchant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
        <p className="font-display text-xl font-semibold text-ink">This link isn&apos;t active</p>
        <p className="mt-2 max-w-xs text-sm text-ink-muted">
          Check the link and try again, or ask for a new one.
        </p>
      </div>
    );
  }

  const message = buildCustomerChatMessage(state.merchant, referrer);
  const whatsAppUrl = buildWhatsAppLink(state.merchant.whatsappNumber, message);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      {!ready ? (
        <div className="flex flex-col items-center animate-fade-in">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-border-strong border-t-brand" />
          <p className="mt-5 text-[15px] text-ink-muted">
            Opening {state.merchant.businessName} on WhatsApp&hellip;
          </p>
        </div>
      ) : (
        <div className="flex w-full max-w-xs flex-col items-center animate-pop">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-money-tint">
            <MessageCircle className="h-6 w-6 text-money" />
          </div>
          <h1 className="mt-5 font-display text-xl font-semibold text-ink">
            {referrer.name.split(" ")[0]} sent you to {state.merchant.businessName}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            We&apos;ll let them know if you order - continue in WhatsApp to chat.
          </p>
          <Button size="lg" variant="money" className="mt-6 w-full" asChild>
            <a href={whatsAppUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Open WhatsApp
            </a>
          </Button>
          {tracked && (
            <p className="mt-4 flex items-center gap-1.5 text-[13px] text-ink-faint">
              <CheckCircle2 className="h-3.5 w-3.5 text-money" />
              Referral tracked
            </p>
          )}
        </div>
      )}
    </div>
  );
}
