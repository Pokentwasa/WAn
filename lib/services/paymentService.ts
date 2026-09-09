import type { PaymentRequest } from "../types";
import { generatePaymentId } from "../utils";

export interface CreatePaymentRequestInput {
  merchantId: string;
  customerId: string;
  customerName: string;
  description: string;
  amount: number;
  referrerId: string | null;
  campaignId: string | null;
}

export async function createPaymentRequest(
  input: CreatePaymentRequestInput,
  existingIds: string[]
): Promise<PaymentRequest> {
  let id = generatePaymentId();
  let attempts = 0;
  while (existingIds.includes(id) && attempts < 10) {
    id = generatePaymentId();
    attempts += 1;
  }
  return {
    id,
    merchantId: input.merchantId,
    customerId: input.customerId,
    customerName: input.customerName.trim(),
    description: input.description.trim(),
    amount: input.amount,
    referrerId: input.referrerId,
    campaignId: input.campaignId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

export function buildPayUrl(paymentRequestId: string, origin: string): string {
  return `${origin}/pay/${paymentRequestId}`;
}
