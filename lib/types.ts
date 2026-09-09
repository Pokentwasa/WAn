// ---------------------------------------------------------------------------
// Core data models.
//
// These map 1:1 to what will eventually become Supabase tables. Every model
// uses plain string ids so swapping the in-memory store for Supabase later
// only means changing lib/services/*.ts, not these shapes or the UI.
// ---------------------------------------------------------------------------

export type BusinessCategory =
  | "food_baking"
  | "beauty_hair"
  | "fashion"
  | "events"
  | "photography"
  | "other";

export type RewardType = "fixed" | "percentage";

export interface Merchant {
  id: string;
  businessName: string;
  whatsappNumber: string; // local SA format, e.g. "082 555 0101"
  category: BusinessCategory;
  rewardType: RewardType;
  rewardValue: number; // rand amount if fixed, percentage points if percentage
  customerDiscountPercent: number | null; // optional incentive shown to referred customers
  platformFeePercent: number; // what we take on successful referred sales
  yocoConnected: boolean; // demo-only flag
  onboardingComplete: boolean;
  createdAt: string;
}

export interface Referrer {
  id: string;
  merchantId: string;
  name: string;
  phone: string;
  code: string; // e.g. "THANDO82"
  createdAt: string;
  // Historical top-of-funnel volume seeded for the demo (clicks and chats
  // that happened before this session). Real activity from this session
  // (visiting /r/[code], new sales) is added on top by referralService.
  baselineClicks: number;
  baselineCustomers: number;
}

export interface ReferralLink {
  id: string;
  referrerId: string;
  code: string; // matches Referrer.code, kept separate so a referrer could hold >1 link later
  path: string; // "/r/thando82"
  createdAt: string;
}

export interface ReferralClick {
  id: string;
  referralLinkId: string;
  referrerId: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  merchantId: string;
  name: string;
  phone?: string;
  referredByReferrerId: string | null;
  createdAt: string;
}

export type CampaignStatus = "active" | "paused" | "ended";

export interface Campaign {
  id: string;
  merchantId: string;
  name: string;
  rewardType: RewardType;
  rewardValue: number;
  customerDiscountPercent: number | null;
  status: CampaignStatus;
  createdAt: string;
}

export type PaymentRequestStatus = "pending" | "paid" | "cancelled";

export interface PaymentRequest {
  id: string; // e.g. "PAY8291"
  merchantId: string;
  customerId: string;
  customerName: string;
  description: string;
  amount: number;
  referrerId: string | null;
  campaignId: string | null;
  status: PaymentRequestStatus;
  createdAt: string;
}

export type PaymentMethod = "card" | "apple_pay" | "google_pay";
export type PaymentStatus = "successful" | "failed";

// Represents the record our mock Yoco service returns. A real integration
// would populate this from Yoco webhook payloads instead.
export interface Payment {
  id: string;
  paymentRequestId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  processedAt: string;
}

export type SaleStatus = "paid" | "awaiting_payment" | "cancelled";

export interface PlatformFee {
  saleId: string;
  amount: number;
  percent: number;
}

export interface Reward {
  id: string;
  referrerId: string;
  saleId: string;
  amount: number;
  paid: boolean;
  paidAt: string | null;
  createdAt: string;
}

export interface ReferralSale {
  id: string;
  merchantId: string;
  customerId: string;
  customerName: string;
  referrerId: string | null;
  referrerName: string | null;
  campaignId: string | null;
  paymentRequestId: string;
  paymentId: string | null;
  amount: number;
  rewardAmount: number;
  platformFeeAmount: number;
  status: SaleStatus;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Mock Yoco webhook event shapes. A real Yoco integration would send these
// over HTTP to a webhook route; the mock service calls the same handler
// in-process instead. See lib/services/yocoService.ts.
// ---------------------------------------------------------------------------

export type YocoEventType =
  | "payment.created"
  | "payment.succeeded"
  | "payment.failed"
  | "payment.refunded";

export interface YocoEvent {
  type: YocoEventType;
  paymentRequestId: string;
  paymentId: string;
  amount: number;
  method: PaymentMethod;
  timestamp: string;
}
