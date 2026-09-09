import type { Campaign, RewardType, ReferralSale } from "../types";
import { generateId } from "../utils";

export interface CreateCampaignInput {
  name: string;
  rewardType: RewardType;
  rewardValue: number;
  customerDiscountPercent: number | null;
}

export async function createCampaign(
  merchantId: string,
  input: CreateCampaignInput
): Promise<Campaign> {
  return {
    id: generateId("camp_"),
    merchantId,
    name: input.name.trim(),
    rewardType: input.rewardType,
    rewardValue: input.rewardValue,
    customerDiscountPercent: input.customerDiscountPercent,
    status: "active",
    createdAt: new Date().toISOString(),
  };
}

export interface CampaignStats {
  referrerCount: number;
  saleCount: number;
  revenue: number;
  rewardCost: number;
}

export function getCampaignStats(
  campaign: Campaign,
  sales: ReferralSale[]
): CampaignStats {
  const campaignSales = sales.filter((s) => s.campaignId === campaign.id);
  const paidSales = campaignSales.filter((s) => s.status === "paid");
  const referrerIds = new Set(
    campaignSales.filter((s) => s.referrerId).map((s) => s.referrerId)
  );
  return {
    referrerCount: referrerIds.size,
    saleCount: campaignSales.length,
    revenue: paidSales.reduce((sum, s) => sum + s.amount, 0),
    rewardCost: paidSales.reduce((sum, s) => sum + s.rewardAmount, 0),
  };
}
