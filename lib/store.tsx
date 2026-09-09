"use client";

// ---------------------------------------------------------------------------
// AppDataProvider
//
// Stands in for Supabase for this prototype: one Context holds every table
// as a plain array, persisted to localStorage so a demo survives a refresh.
// Every mutation goes through lib/services/* first, so when Supabase gets
// plugged in, this file becomes a thin wrapper around real queries instead
// of the source of truth itself - the service functions don't change shape.
// ---------------------------------------------------------------------------

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  Campaign,
  Customer,
  Merchant,
  Payment,
  PaymentMethod,
  PaymentRequest,
  Referrer,
  ReferralSale,
  Reward,
} from "./types";
import {
  seedCampaigns,
  seedCustomers,
  seedMerchant,
  seedPaymentRequests,
  seedPayments,
  seedReferralSales,
  seedReferrers,
  seedRewards,
  MERCHANT_ID,
} from "./mock-data";
import { generateId } from "./utils";
import * as merchantService from "./services/merchantService";
import * as referralService from "./services/referralService";
import * as campaignService from "./services/campaignService";
import * as paymentService from "./services/paymentService";
import * as rewardService from "./services/rewardService";
import * as yocoService from "./services/yocoService";

const STORAGE_KEY = "wa-referral-commerce:v1";
const STORAGE_VERSION = 1;

interface AppState {
  version: number;
  merchant: Merchant | null;
  referrers: Referrer[];
  customers: Customer[];
  campaigns: Campaign[];
  paymentRequests: PaymentRequest[];
  payments: Payment[];
  referralSales: ReferralSale[];
  rewards: Reward[];
  clicksByReferrer: Record<string, number>;
}

function seedState(): AppState {
  return {
    version: STORAGE_VERSION,
    merchant: seedMerchant,
    referrers: seedReferrers,
    customers: seedCustomers,
    campaigns: seedCampaigns,
    paymentRequests: seedPaymentRequests,
    payments: seedPayments,
    referralSales: seedReferralSales,
    rewards: seedRewards,
    clicksByReferrer: {},
  };
}

/** A blank merchant hasn't onboarded yet - used when someone wants to see the onboarding flow from scratch. */
function blankState(): AppState {
  return {
    version: STORAGE_VERSION,
    merchant: null,
    referrers: [],
    customers: [],
    campaigns: [],
    paymentRequests: [],
    payments: [],
    referralSales: [],
    rewards: [],
    clicksByReferrer: {},
  };
}

interface AppDataContextValue {
  state: AppState;
  isHydrated: boolean;
  // lookups
  getReferrerByCode: (code: string) => Referrer | undefined;
  getPaymentRequestById: (id: string) => PaymentRequest | undefined;
  getActiveCampaign: () => Campaign | null;
  // actions
  completeOnboarding: (input: merchantService.OnboardingInput) => Promise<void>;
  updateMerchantSettings: (patch: Partial<Merchant>) => void;
  addReferrer: (input: referralService.AddReferrerInput) => Promise<Referrer>;
  recordReferralClick: (code: string) => void;
  createPaymentRequest: (
    input: Omit<paymentService.CreatePaymentRequestInput, "merchantId" | "customerId"> & {
      customerName: string;
    }
  ) => Promise<PaymentRequest>;
  completePayment: (
    paymentRequestId: string,
    method: PaymentMethod,
    outcome?: "succeeded" | "failed"
  ) => Promise<{ success: boolean; sale: ReferralSale | null }>;
  markRewardPaid: (rewardId: string) => void;
  addCampaign: (input: campaignService.CreateCampaignInput) => Promise<Campaign>;
  resetDemo: () => void;
  startFresh: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedState);
  const [isHydrated, setIsHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Hydrate from localStorage after mount only, so server and first client
  // render always agree (avoids React hydration warnings).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed.version === STORAGE_VERSION) {
          setState(parsed);
        }
      }
    } catch {
      // Corrupt or inaccessible storage - fall back to seed data silently.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const persist = useCallback((next: AppState) => {
    setState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage full or unavailable (private browsing) - demo still works
      // in-memory for the rest of the session.
    }
  }, []);

  const getReferrerByCode = useCallback(
    (code: string) =>
      stateRef.current.referrers.find(
        (r) => r.code.toLowerCase() === code.toLowerCase()
      ),
    []
  );

  const getPaymentRequestById = useCallback(
    (id: string) => stateRef.current.paymentRequests.find((p) => p.id === id),
    []
  );

  const getActiveCampaign = useCallback((): Campaign | null => {
    return (
      stateRef.current.campaigns.find((c) => c.status === "active") ?? null
    );
  }, []);

  const completeOnboarding = useCallback(
    async (input: merchantService.OnboardingInput) => {
      const merchant = await merchantService.createMerchantFromOnboarding(input);
      const campaign = await campaignService.createCampaign(merchant.id, {
        name: "First Referral Campaign",
        rewardType: input.rewardType,
        rewardValue: input.rewardValue,
        customerDiscountPercent: input.customerDiscountPercent,
      });
      persist({
        ...blankState(),
        merchant,
        campaigns: [campaign],
      });
    },
    [persist]
  );

  const updateMerchantSettings = useCallback(
    (patch: Partial<Merchant>) => {
      const current = stateRef.current;
      if (!current.merchant) return;
      persist({ ...current, merchant: { ...current.merchant, ...patch } });
    },
    [persist]
  );

  const addReferrer = useCallback(
    async (input: referralService.AddReferrerInput) => {
      const current = stateRef.current;
      if (!current.merchant) throw new Error("No merchant set up yet");
      const referrer = await referralService.createReferrer(
        current.merchant.id,
        input,
        current.referrers.map((r) => r.code)
      );
      persist({ ...current, referrers: [referrer, ...current.referrers] });
      return referrer;
    },
    [persist]
  );

  const recordReferralClick = useCallback(
    (code: string) => {
      const current = stateRef.current;
      const referrer = current.referrers.find(
        (r) => r.code.toLowerCase() === code.toLowerCase()
      );
      if (!referrer) return;
      persist({
        ...current,
        clicksByReferrer: {
          ...current.clicksByReferrer,
          [referrer.id]: (current.clicksByReferrer[referrer.id] ?? 0) + 1,
        },
      });
    },
    [persist]
  );

  const createPaymentRequest = useCallback(
    async (
      input: Omit<paymentService.CreatePaymentRequestInput, "merchantId" | "customerId"> & {
        customerName: string;
      }
    ) => {
      const current = stateRef.current;
      if (!current.merchant) throw new Error("No merchant set up yet");

      let customer = current.customers.find(
        (c) =>
          c.name.toLowerCase() === input.customerName.trim().toLowerCase() &&
          c.referredByReferrerId === input.referrerId
      );
      let customers = current.customers;
      if (!customer) {
        customer = {
          id: generateId("cust_"),
          merchantId: current.merchant.id,
          name: input.customerName.trim(),
          referredByReferrerId: input.referrerId,
          createdAt: new Date().toISOString(),
        };
        customers = [customer, ...customers];
      }

      const campaignId = input.campaignId ?? getActiveCampaign()?.id ?? null;

      const paymentRequest = await paymentService.createPaymentRequest(
        {
          merchantId: current.merchant.id,
          customerId: customer.id,
          customerName: customer.name,
          description: input.description,
          amount: input.amount,
          referrerId: input.referrerId,
          campaignId,
        },
        current.paymentRequests.map((p) => p.id)
      );

      persist({
        ...current,
        customers,
        paymentRequests: [paymentRequest, ...current.paymentRequests],
      });

      return paymentRequest;
    },
    [persist, getActiveCampaign]
  );

  const completePayment = useCallback(
    async (
      paymentRequestId: string,
      method: PaymentMethod,
      outcome: "succeeded" | "failed" = "succeeded"
    ) => {
      const current = stateRef.current;
      const paymentRequest = current.paymentRequests.find(
        (p) => p.id === paymentRequestId
      );
      if (!paymentRequest || !current.merchant) {
        return { success: false, sale: null };
      }

      const { event, payment } = await yocoService.startCheckout(
        paymentRequest,
        method,
        outcome
      );
      const decision = yocoService.handleYocoWebhookEvent(event);

      const latest = stateRef.current;
      const payments = [payment, ...latest.payments];

      if (!decision.shouldAttributeReferralSale) {
        persist({ ...latest, payments });
        return { success: false, sale: null };
      }

      const campaign = paymentRequest.campaignId
        ? latest.campaigns.find((c) => c.id === paymentRequest.campaignId) ?? null
        : null;

      const { rewardAmount, platformFeeAmount } = rewardService.calculateAttribution(
        paymentRequest.amount,
        latest.merchant!,
        campaign
      );

      const sale: ReferralSale = {
        id: generateId("sale_"),
        merchantId: latest.merchant!.id,
        customerId: paymentRequest.customerId,
        customerName: paymentRequest.customerName,
        referrerId: paymentRequest.referrerId,
        referrerName: paymentRequest.referrerId
          ? latest.referrers.find((r) => r.id === paymentRequest.referrerId)?.name ?? null
          : null,
        campaignId: paymentRequest.campaignId,
        paymentRequestId: paymentRequest.id,
        paymentId: payment.id,
        amount: paymentRequest.amount,
        rewardAmount: paymentRequest.referrerId ? rewardAmount : 0,
        platformFeeAmount,
        status: "paid",
        createdAt: new Date().toISOString(),
      };

      const rewards = [...latest.rewards];
      if (paymentRequest.referrerId) {
        rewards.unshift(
          rewardService.createReward(paymentRequest.referrerId, sale.id, rewardAmount)
        );
      }

      const paymentRequests = latest.paymentRequests.map((p) =>
        p.id === paymentRequestId ? { ...p, status: "paid" as const } : p
      );

      persist({
        ...latest,
        payments,
        paymentRequests,
        referralSales: [sale, ...latest.referralSales],
        rewards,
      });

      return { success: true, sale };
    },
    [persist]
  );

  const markRewardPaid = useCallback(
    (rewardId: string) => {
      const current = stateRef.current;
      const rewards = current.rewards.map((r) =>
        r.id === rewardId
          ? { ...r, paid: true, paidAt: new Date().toISOString() }
          : r
      );
      persist({ ...current, rewards });
    },
    [persist]
  );

  const addCampaign = useCallback(
    async (input: campaignService.CreateCampaignInput) => {
      const current = stateRef.current;
      if (!current.merchant) throw new Error("No merchant set up yet");
      const campaign = await campaignService.createCampaign(current.merchant.id, input);
      persist({ ...current, campaigns: [campaign, ...current.campaigns] });
      return campaign;
    },
    [persist]
  );

  const resetDemo = useCallback(() => {
    persist(seedState());
  }, [persist]);

  const startFresh = useCallback(() => {
    persist(blankState());
  }, [persist]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      state,
      isHydrated,
      getReferrerByCode,
      getPaymentRequestById,
      getActiveCampaign,
      completeOnboarding,
      updateMerchantSettings,
      addReferrer,
      recordReferralClick,
      createPaymentRequest,
      completePayment,
      markRewardPaid,
      addCampaign,
      resetDemo,
      startFresh,
    }),
    [
      state,
      isHydrated,
      getReferrerByCode,
      getPaymentRequestById,
      getActiveCampaign,
      completeOnboarding,
      updateMerchantSettings,
      addReferrer,
      recordReferralClick,
      createPaymentRequest,
      completePayment,
      markRewardPaid,
      addCampaign,
      resetDemo,
      startFresh,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return ctx;
}

export { MERCHANT_ID };
