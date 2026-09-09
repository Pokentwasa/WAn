import {
  LayoutGrid,
  Users,
  Receipt,
  Megaphone,
  CreditCard,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/referrers", label: "Referrers", icon: Users },
  { href: "/dashboard/sales", label: "Sales", icon: Receipt },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;
