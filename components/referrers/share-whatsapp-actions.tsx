"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";
import {
  buildReferralUrl,
  buildReferrerShareMessage,
} from "@/lib/services/referralService";
import { buildWhatsAppLink } from "@/lib/utils";
import type { Referrer } from "@/lib/types";

export function ShareWhatsAppActions({ referrer }: { referrer: Referrer }) {
  const { state } = useAppData();
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const linkUrl = buildReferralUrl(referrer.code, origin);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable - the link is still visible to copy by hand.
    }
  }

  function handleShare() {
    if (!state.merchant) return;
    const message = buildReferrerShareMessage(state.merchant, referrer, linkUrl);
    window.open(buildWhatsAppLink(referrer.phone, message), "_blank");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 rounded-sm border border-border-strong bg-paper px-3.5 py-3">
        <p className="truncate text-sm font-medium text-ink">{linkUrl}</p>
        <button
          onClick={handleCopy}
          className="shrink-0 text-ink-muted transition-colors hover:text-ink"
          aria-label="Copy link"
        >
          {copied ? <Check className="h-4 w-4 text-money" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <div className="flex gap-2.5">
        <Button variant="secondary" className="flex-1" onClick={handleCopy}>
          {copied ? "Copied" : "Copy link"}
        </Button>
        <Button variant="money" className="flex-1" onClick={handleShare}>
          <MessageCircle className="h-4 w-4" />
          Share on WhatsApp
        </Button>
      </div>
    </div>
  );
}
