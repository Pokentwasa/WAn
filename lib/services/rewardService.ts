import type { Merchant, Reward, Campaign } from "../types";
import { generateId } from "../utils";

export interface Attribution {
  rewardAmount: number;
  platformFeeAmount: number;
  merchantAmount: number;
}

/**
 * The core money math: given a sale amount and the reward rule that applies
 * (a campaign's rule if the sale is tied to one, otherwise the merchant's
 * default), work out what the referrer earns, what the platform keeps, and
 * what's left for the merchant.
 */
export function calculateAttribution(
  amount: number,
  merchant: Merchant,
  campaign: Campaign | null
): Attribution {
  const rewardType = campaign?.rewardType ?? merchant.rewardType;
  const rewardValue = campaign?.rewardValue ?? merchant.rewardValue;

  const rewardAmount =
    rewardType === "percentage"
      ? round2((amount * rewardValue) / 100)
      : round2(Math.min(rewardValue, amount));

  const platformFeeAmount = round2((amount * merchant.platformFeePercent) / 100);
  const merchantAmount = round2(amount - platformFeeAmount);

  return { rewardAmount, platformFeeAmount, merchantAmount };
}

export function createReward(referrerId: string, saleId: string, amount: number): Reward {
  return {
    id: generateId("reward_"),
    referrerId,
    saleId,
    amount,
    paid: false,
    paidAt: null,
    createdAt: new Date().toISOString(),
  };
}

export interface RewardSummary {
  earned: number;
  paid: number;
  outstanding: number;
}

export function getRewardSummaryForReferrer(
  referrerId: string,
  rewards: Reward[]
): RewardSummary {
  const referrerRewards = rewards.filter((r) => r.referrerId === referrerId);
  const earned = referrerRewards.reduce((sum, r) => sum + r.amount, 0);
  const paid = referrerRewards
    .filter((r) => r.paid)
    .reduce((sum, r) => sum + r.amount, 0);
  return { earned, paid, outstanding: round2(earned - paid) };
}

export function totalOutstanding(rewards: Reward[]): number {
  return round2(
    rewards.filter((r) => !r.paid).reduce((sum, r) => sum + r.amount, 0)
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
