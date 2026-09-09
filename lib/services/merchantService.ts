// ---------------------------------------------------------------------------
// merchantService
//
// Everything to do with the merchant's own profile: onboarding and settings.
// Every function here is written as if it were hitting Supabase - callers
// already `await` them - so swapping the body for a real `supabase.from(...)`
// call later touches nothing outside this file.
// ---------------------------------------------------------------------------

import type { BusinessCategory, Merchant, RewardType } from "../types";
import { MERCHANT_ID } from "../mock-data";

export interface OnboardingInput {
  businessName: string;
  whatsappNumber: string;
  category: BusinessCategory;
  rewardType: RewardType;
  rewardValue: number;
  customerDiscountPercent: number | null;
}

const PLATFORM_FEE_PERCENT = 5;

export async function createMerchantFromOnboarding(
  input: OnboardingInput
): Promise<Merchant> {
  return {
    id: MERCHANT_ID,
    businessName: input.businessName.trim(),
    whatsappNumber: input.whatsappNumber.trim(),
    category: input.category,
    rewardType: input.rewardType,
    rewardValue: input.rewardValue,
    customerDiscountPercent: input.customerDiscountPercent,
    platformFeePercent: PLATFORM_FEE_PERCENT,
    yocoConnected: true,
    onboardingComplete: true,
    createdAt: new Date().toISOString(),
  };
}

export async function updateMerchant(
  merchant: Merchant,
  patch: Partial<Merchant>
): Promise<Merchant> {
  return { ...merchant, ...patch };
}

export const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  food_baking: "Food & Baking",
  beauty_hair: "Beauty & Hair",
  fashion: "Fashion",
  events: "Events",
  photography: "Photography",
  other: "Other",
};
