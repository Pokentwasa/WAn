// ---------------------------------------------------------------------------
// yocoService (mock)
//
// Stands in for the real Yoco Online integration. `startCheckout` mimics
// creating a Yoco charge and waiting on it; `handleYocoWebhookEvent` mimics
// the handler a real integration would expose at e.g. /api/yoco/webhook.
//
// To go live later:
//   1. Replace `startCheckout` with a call to Yoco's Checkout API and
//      redirect the customer to the returned redirectUrl.
//   2. Point Yoco's webhook at /api/yoco/webhook and forward the payload
//      into `handleYocoWebhookEvent` unchanged - its shape already matches
//      YocoEvent.
// Nothing in the UI needs to change either way.
// ---------------------------------------------------------------------------

import type { Payment, PaymentMethod, PaymentRequest, YocoEvent } from "../types";
import { generateId } from "../utils";

const SIMULATED_PROCESSING_MS = 1600;

export interface CheckoutResult {
  event: YocoEvent;
  payment: Payment;
}

/**
 * Simulates sending a card/wallet charge to Yoco and waiting for the result.
 * `outcome` defaults to "succeeded" for the main demo path; pass "failed" to
 * exercise the decline path shown on the Payments screen.
 */
export async function startCheckout(
  paymentRequest: PaymentRequest,
  method: PaymentMethod,
  outcome: "succeeded" | "failed" = "succeeded"
): Promise<CheckoutResult> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_PROCESSING_MS));

  const now = new Date().toISOString();
  const paymentId = generateId("pmt_");

  const event: YocoEvent = {
    type: outcome === "succeeded" ? "payment.succeeded" : "payment.failed",
    paymentRequestId: paymentRequest.id,
    paymentId,
    amount: paymentRequest.amount,
    method,
    timestamp: now,
  };

  const payment: Payment = {
    id: paymentId,
    paymentRequestId: paymentRequest.id,
    method,
    status: outcome === "succeeded" ? "successful" : "failed",
    amount: paymentRequest.amount,
    processedAt: now,
  };

  return { event, payment };
}

/**
 * What a real /api/yoco/webhook route would do with an incoming event.
 * Kept pure (no side effects) so it is easy to unit test and easy to wire
 * up to Supabase writes later - it just describes what should change.
 */
export function handleYocoWebhookEvent(event: YocoEvent): {
  shouldMarkPaymentRequestPaid: boolean;
  shouldAttributeReferralSale: boolean;
} {
  switch (event.type) {
    case "payment.succeeded":
      return { shouldMarkPaymentRequestPaid: true, shouldAttributeReferralSale: true };
    case "payment.failed":
    case "payment.refunded":
    case "payment.created":
    default:
      return { shouldMarkPaymentRequestPaid: false, shouldAttributeReferralSale: false };
  }
}
