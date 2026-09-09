"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
import { buildPayUrl } from "@/lib/services/paymentService";
import { formatRand } from "@/lib/utils";
import type { PaymentRequest } from "@/lib/types";

interface RequestPaymentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-select a referrer, e.g. when opened from a referrer's own page. */
  defaultReferrerId?: string | null;
}

export function RequestPaymentSheet({
  open,
  onOpenChange,
  defaultReferrerId = null,
}: RequestPaymentSheetProps) {
  const router = useRouter();
  const { state, createPaymentRequest } = useAppData();

  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [referrerId, setReferrerId] = useState<string>(defaultReferrerId ?? "none");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<PaymentRequest | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setReferrerId(defaultReferrerId ?? "none");
    } else {
      const t = setTimeout(() => {
        setCustomerName("");
        setDescription("");
        setAmount("");
        setCreated(null);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open, defaultReferrerId]);

  const canCreate =
    customerName.trim().length > 1 &&
    description.trim().length > 1 &&
    Number(amount) > 0;

  async function handleCreate() {
    setSubmitting(true);
    const request = await createPaymentRequest({
      customerName,
      description,
      amount: Number(amount),
      referrerId: referrerId === "none" ? null : referrerId,
      campaignId: null,
    });
    setSubmitting(false);
    setCreated(request);
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const payUrl = created ? buildPayUrl(created.id, origin) : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(payUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable - link text is still visible.
    }
  }

  function handleOpenCheckout() {
    if (!created) return;
    onOpenChange(false);
    router.push(`/pay/${created.id}`);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {!created ? (
          <>
            <SheetHeader>
              <SheetTitle>Request payment</SheetTitle>
              <SheetDescription>
                We&apos;ll generate a payment link, powered by Yoco.
              </SheetDescription>
            </SheetHeader>
            <SheetBody className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pay-customer">Customer</Label>
                <Input
                  id="pay-customer"
                  autoFocus
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Naledi"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pay-description">Order description</Label>
                <Input
                  id="pay-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="21st Birthday Cake"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pay-amount">Amount</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                    R
                  </span>
                  <Input
                    id="pay-amount"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="1,200"
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Referral</Label>
                <Select value={referrerId} onValueChange={setReferrerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="No referral" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No referral (direct sale)</SelectItem>
                    {state.referrers.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SheetBody>
            <SheetFooter>
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={!canCreate || submitting}
                onClick={handleCreate}
              >
                {submitting ? "Creating link..." : "Create payment link"}
              </Button>
            </SheetFooter>
          </>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Payment link ready</SheetTitle>
              <SheetDescription>
                {formatRand(created.amount)} for {created.description} &middot;{" "}
                {created.customerName}
              </SheetDescription>
            </SheetHeader>
            <SheetBody className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 rounded-sm border border-border-strong bg-paper px-3.5 py-3">
                <p className="truncate text-sm font-medium text-ink">{payUrl}</p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 text-ink-muted transition-colors hover:text-ink"
                  aria-label="Copy link"
                >
                  {copied ? <Check className="h-4 w-4 text-money" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[13px] text-ink-muted">Powered by Yoco</p>
            </SheetBody>
            <SheetFooter>
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy link"}
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleOpenCheckout}>
                <ExternalLink className="h-4 w-4" />
                Open checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
