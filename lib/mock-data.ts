import type {
  Merchant,
  Referrer,
  Customer,
  Campaign,
  PaymentRequest,
  Payment,
  ReferralSale,
  Reward,
} from "./types";

// ---------------------------------------------------------------------------
// Demo merchant: Sweet by Kay, a home bakery in Cape Town.
// All data below is static and deterministic so server and client render
// identically on first load. Live demo actions (adding a referrer, sending
// a payment request, completing a mock payment) are layered on top of this
// by the AppDataProvider at runtime.
// ---------------------------------------------------------------------------

export const MERCHANT_ID = "merchant_sweetbykay";

export const seedMerchant: Merchant = {
  id: MERCHANT_ID,
  businessName: "Sweet by Kay",
  whatsappNumber: "082 555 0101",
  category: "food_baking",
  rewardType: "percentage",
  rewardValue: 10,
  customerDiscountPercent: 5,
  platformFeePercent: 5,
  yocoConnected: true,
  onboardingComplete: true,
  createdAt: "2026-08-01T09:00:00.000Z",
};

export const seedReferrers: Referrer[] = [
  {
    id: "ref_thando",
    merchantId: MERCHANT_ID,
    name: "Thando M.",
    phone: "071 234 5678",
    code: "THANDO82",
    createdAt: "2026-08-03T10:00:00.000Z",
    baselineClicks: 38,
    baselineCustomers: 12,
  },
  {
    id: "ref_lerato",
    merchantId: MERCHANT_ID,
    name: "Lerato N.",
    phone: "082 345 6789",
    code: "LERATO91",
    createdAt: "2026-08-05T10:00:00.000Z",
    baselineClicks: 29,
    baselineCustomers: 9,
  },
  {
    id: "ref_amanda",
    merchantId: MERCHANT_ID,
    name: "Amanda K.",
    phone: "083 456 7890",
    code: "AMANDA37",
    createdAt: "2026-08-10T10:00:00.000Z",
    baselineClicks: 22,
    baselineCustomers: 7,
  },
  {
    id: "ref_sipho",
    merchantId: MERCHANT_ID,
    name: "Sipho D.",
    phone: "084 567 8901",
    code: "SIPHO64",
    createdAt: "2026-08-14T10:00:00.000Z",
    baselineClicks: 15,
    baselineCustomers: 4,
  },
];

export const seedCampaigns: Campaign[] = [
  {
    id: "camp_august",
    merchantId: MERCHANT_ID,
    name: "August Launch Referrals",
    rewardType: "percentage",
    rewardValue: 10,
    customerDiscountPercent: 5,
    status: "ended",
    createdAt: "2026-08-01T09:00:00.000Z",
  },
  {
    id: "camp_september",
    merchantId: MERCHANT_ID,
    name: "September Cake Referrals",
    rewardType: "percentage",
    rewardValue: 10,
    customerDiscountPercent: 5,
    status: "active",
    createdAt: "2026-09-01T09:00:00.000Z",
  },
];

// Each row below is one referred customer -> one sale -> one payment.
// Amounts already reflect the merchant's 10% reward / 5% platform fee.
interface SeedSaleRow {
  n: number;
  customerName: string;
  referrerId: string;
  amount: number;
  status: "paid" | "awaiting_payment";
  campaignId: string;
  createdAt: string;
  rewardPaid: boolean;
  method: "card" | "apple_pay" | "google_pay";
  description: string;
}

const rows: SeedSaleRow[] = [
  { n: 1, customerName: "Naledi", referrerId: "ref_thando", amount: 1200, status: "paid", campaignId: "camp_august", createdAt: "2026-08-10T09:00:00.000Z", rewardPaid: true, method: "card", description: "21st Birthday Cake" },
  { n: 2, customerName: "Sihle", referrerId: "ref_lerato", amount: 850, status: "paid", campaignId: "camp_august", createdAt: "2026-08-12T10:00:00.000Z", rewardPaid: true, method: "card", description: "Cupcake box (24)" },
  { n: 3, customerName: "Karabo", referrerId: "ref_thando", amount: 900, status: "paid", campaignId: "camp_august", createdAt: "2026-08-15T16:00:00.000Z", rewardPaid: false, method: "apple_pay", description: "Baby shower cake" },
  { n: 4, customerName: "Lindiwe", referrerId: "ref_amanda", amount: 1200, status: "paid", campaignId: "camp_august", createdAt: "2026-08-18T11:30:00.000Z", rewardPaid: false, method: "card", description: "Engagement cake" },
  { n: 5, customerName: "Palesa", referrerId: "ref_lerato", amount: 900, status: "paid", campaignId: "camp_august", createdAt: "2026-08-20T14:10:00.000Z", rewardPaid: false, method: "google_pay", description: "Wedding cupcakes" },
  { n: 6, customerName: "Refilwe", referrerId: "ref_thando", amount: 1200, status: "paid", campaignId: "camp_august", createdAt: "2026-08-22T09:40:00.000Z", rewardPaid: true, method: "card", description: "Christening cake" },
  { n: 7, customerName: "Kagiso", referrerId: "ref_amanda", amount: 1400, status: "paid", campaignId: "camp_august", createdAt: "2026-08-25T17:00:00.000Z", rewardPaid: false, method: "card", description: "Graduation cake" },
  { n: 8, customerName: "Mpho", referrerId: "ref_lerato", amount: 800, status: "paid", campaignId: "camp_august", createdAt: "2026-08-28T10:20:00.000Z", rewardPaid: false, method: "apple_pay", description: "Cupcake box (24)" },
  { n: 9, customerName: "Katlego", referrerId: "ref_thando", amount: 1100, status: "paid", campaignId: "camp_august", createdAt: "2026-08-30T12:00:00.000Z", rewardPaid: true, method: "card", description: "Bridal shower cake" },
  { n: 10, customerName: "Ayanda", referrerId: "ref_sipho", amount: 800, status: "paid", campaignId: "camp_september", createdAt: "2026-09-02T08:45:00.000Z", rewardPaid: false, method: "card", description: "Cupcake box (24)" },
  { n: 11, customerName: "Zanele", referrerId: "ref_lerato", amount: 800, status: "paid", campaignId: "camp_september", createdAt: "2026-09-03T13:00:00.000Z", rewardPaid: false, method: "google_pay", description: "Farewell cake" },
  { n: 12, customerName: "Nomsa", referrerId: "ref_thando", amount: 1000, status: "paid", campaignId: "camp_september", createdAt: "2026-09-04T09:15:00.000Z", rewardPaid: false, method: "card", description: "Housewarming cake" },
  { n: 13, customerName: "Nokuthula", referrerId: "ref_sipho", amount: 800, status: "paid", campaignId: "camp_september", createdAt: "2026-09-06T10:00:00.000Z", rewardPaid: false, method: "apple_pay", description: "Cupcake box (24)" },
  { n: 14, customerName: "Zama", referrerId: "ref_amanda", amount: 1500, status: "awaiting_payment", campaignId: "camp_september", createdAt: "2026-09-07T19:22:00.000Z", rewardPaid: false, method: "card", description: "Birthday Cake" },
  { n: 15, customerName: "Andile", referrerId: "ref_thando", amount: 1500, status: "paid", campaignId: "camp_september", createdAt: "2026-09-08T11:05:00.000Z", rewardPaid: false, method: "card", description: "50th Birthday Cake" },
  { n: 16, customerName: "Boitumelo", referrerId: "ref_amanda", amount: 2100, status: "paid", campaignId: "camp_september", createdAt: "2026-09-08T16:40:00.000Z", rewardPaid: false, method: "card", description: "Wedding Cake (3-tier)" },
];

const REWARD_RATE = 0.10;
const FEE_RATE = 0.05;

// A payment request where the customer's card was declined, so the sale
// never gets attributed. Kept separate from `rows` since a failed attempt
// produces no ReferralSale - only rows above represent confirmed revenue.
export const seedFailedPaymentRequest: PaymentRequest = {
  id: "PAY1017",
  merchantId: MERCHANT_ID,
  customerId: "cust_17",
  customerName: "Thabo",
  description: "Farewell cupcakes (36)",
  amount: 950,
  referrerId: "ref_lerato",
  campaignId: "camp_september",
  status: "pending",
  createdAt: "2026-09-08T18:10:00.000Z",
};

export const seedFailedCustomer: Customer = {
  id: "cust_17",
  merchantId: MERCHANT_ID,
  name: "Thabo",
  referredByReferrerId: "ref_lerato",
  createdAt: "2026-09-08T18:00:00.000Z",
};

export const seedFailedPayment: Payment = {
  id: "pmt_17",
  paymentRequestId: "PAY1017",
  method: "card",
  status: "failed",
  amount: 950,
  processedAt: "2026-09-08T18:11:00.000Z",
};

export const seedCustomers: Customer[] = [
  ...rows.map((r) => ({
    id: `cust_${r.n}`,
    merchantId: MERCHANT_ID,
    name: r.customerName,
    referredByReferrerId: r.referrerId,
    createdAt: r.createdAt,
  })),
  seedFailedCustomer,
];

export const seedPaymentRequests: PaymentRequest[] = [
  ...rows.map((r) => ({
    id: `PAY${1000 + r.n}`,
    merchantId: MERCHANT_ID,
    customerId: `cust_${r.n}`,
    customerName: r.customerName,
    description: r.description,
    amount: r.amount,
    referrerId: r.referrerId,
    campaignId: r.campaignId,
    status: (r.status === "paid" ? "paid" : "pending") as PaymentRequest["status"],
    createdAt: r.createdAt,
  })),
  seedFailedPaymentRequest,
];

export const seedPayments: Payment[] = [
  ...rows
    .filter((r) => r.status === "paid")
    .map((r) => ({
      id: `pmt_${r.n}`,
      paymentRequestId: `PAY${1000 + r.n}`,
      method: r.method,
      status: "successful" as const,
      amount: r.amount,
      processedAt: r.createdAt,
    })),
  seedFailedPayment,
];

export const seedReferralSales: ReferralSale[] = rows.map((r) => {
  const referrer = seedReferrers.find((ref) => ref.id === r.referrerId)!;
  const rewardAmount = Math.round(r.amount * REWARD_RATE * 100) / 100;
  const platformFeeAmount =
    r.status === "paid" ? Math.round(r.amount * FEE_RATE * 100) / 100 : 0;
  return {
    id: `sale_${r.n}`,
    merchantId: MERCHANT_ID,
    customerId: `cust_${r.n}`,
    customerName: r.customerName,
    referrerId: r.referrerId,
    referrerName: referrer.name,
    campaignId: r.campaignId,
    paymentRequestId: `PAY${1000 + r.n}`,
    paymentId: r.status === "paid" ? `pmt_${r.n}` : null,
    amount: r.amount,
    rewardAmount,
    platformFeeAmount,
    status: r.status,
    createdAt: r.createdAt,
  };
});

export const seedRewards: Reward[] = rows
  .filter((r) => r.status === "paid")
  .map((r) => ({
    id: `reward_${r.n}`,
    referrerId: r.referrerId,
    saleId: `sale_${r.n}`,
    amount: Math.round(r.amount * REWARD_RATE * 100) / 100,
    paid: r.rewardPaid,
    paidAt: r.rewardPaid ? "2026-09-01T09:00:00.000Z" : null,
    createdAt: r.createdAt,
  }));
