import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRand(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const [whole, cents] = rounded.toFixed(2).split(".");
  const withThousands = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return cents === "00" ? `R${withThousands}` : `R${withThousands}.${cents}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

/** Turns a name into a referral-style code, e.g. "Thando M." -> "THANDO82" */
export function generateReferralCode(name: string): string {
  const first = name.trim().split(/\s+/)[0] || "REF";
  const base = first.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 8);
  const suffix = Math.floor(10 + Math.random() * 89); // two digits
  return `${base}${suffix}`;
}

export function generateId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}${rand}`;
}

export function generatePaymentId(): string {
  const digits = Math.floor(1000 + Math.random() * 8999);
  return `PAY${digits}`;
}

/** Normalises a South African local number ("082 555 0101") to wa.me format ("27825550101") */
export function toWhatsAppNumber(localNumber: string): string {
  const digits = localNumber.replace(/\D/g, "");
  if (digits.startsWith("27")) return digits;
  if (digits.startsWith("0")) return `27${digits.slice(1)}`;
  return `27${digits}`;
}

export function buildWhatsAppLink(localNumber: string, message: string): string {
  const number = toWhatsAppNumber(localNumber);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Formats raw digits into "082 555 0101" as the user types */
export function formatSAPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean);
  return parts.join(" ");
}
