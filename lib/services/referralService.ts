// ---------------------------------------------------------------------------
// referralService
//
// Owns referrers, their links, and the WhatsApp messages built around them.
// The "click" and "stats" helpers are pure functions over whatever sale/click
// data is passed in, so the dashboard, referrer list, and public /r/[code]
// page all agree on the same numbers.
// ---------------------------------------------------------------------------

import type { Merchant, Referrer, ReferralSale, Reward } from "../types";
import { generateId, generateReferralCode } from "../utils";

export interface AddReferrerInput {
  name: string;
  phone: string;
}

export async function createReferrer(
  merchantId: string,
  input: AddReferrerInput,
  existingCodes: string[]
): Promise<Referrer> {
  let code = generateReferralCode(input.name);
  let attempts = 0;
  while (existingCodes.includes(code) && attempts < 10) {
    code = generateReferralCode(input.name);
    attempts += 1;
  }
  return {
    id: generateId("ref_"),
    merchantId,
    name: input.name.trim(),
    phone: input.phone.trim(),
    code,
    createdAt: new Date().toISOString(),
    baselineClicks: 0,
    baselineCustomers: 0,
  };
}

export function buildReferralPath(code: string): string {
  return `/r/${code.toLowerCase()}`;
}

export function buildReferralUrl(code: string, origin: string): string {
  return `${origin}${buildReferralPath(code)}`;
}

/** The message a referrer sends their friends, sharing their own link. */
export function buildReferrerShareMessage(
  merchant: Merchant,
  referrer: Referrer,
  linkUrl: string
): string {
  const discountLine = merchant.customerDiscountPercent
    ? ` and you'll get ${merchant.customerDiscountPercent}% off`
    : "";
  return `Hey \u{1F44B} I've been buying from ${merchant.businessName} and thought you'd love them too.\n\nOrder through my link${discountLine}:\n${linkUrl}`;
}

/** The message pre-filled into WhatsApp when a referred customer opens the merchant's chat. */
export function buildCustomerChatMessage(
  merchant: Merchant,
  referrer: Referrer
): string {
  return `Hi ${merchant.businessName} \u{1F44B}\n\n${referrer.name} referred me and I'd like to place an order.\n\nReferral: ${referrer.code}`;
}

export interface ReferrerStats {
  clicks: number;
  customers: number;
  sales: number;
  revenue: number;
  rewardsEarned: number;
}

/**
 * Computes the numbers shown on a referrer's card: baseline (seeded) volume
 * plus anything that happened live in this session (new clicks, new sales).
 */
export function getReferrerStats(
  referrer: Referrer,
  liveClicksForReferrer: number,
  sales: ReferralSale[],
  rewards: Reward[]
): ReferrerStats {
  const referrerSales = sales.filter((s) => s.referrerId === referrer.id);
  const paidSales = referrerSales.filter((s) => s.status === "paid");
  const revenue = paidSales.reduce((sum, s) => sum + s.amount, 0);
  const rewardsEarned = rewards
    .filter((r) => r.referrerId === referrer.id)
    .reduce((sum, r) => sum + r.amount, 0);

  return {
    clicks: referrer.baselineClicks + liveClicksForReferrer,
    customers: referrer.baselineCustomers + referrerSales.length,
    sales: referrerSales.length,
    revenue,
    rewardsEarned,
  };
}
