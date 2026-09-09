import { Card } from "@/components/ui/card";
import { formatRand } from "@/lib/utils";

interface SummaryCardsProps {
  referralSales: number;
  referrals: number;
  activeReferrers: number;
  rewardsOwed: number;
}

export function SummaryCards({
  referralSales,
  referrals,
  activeReferrers,
  rewardsOwed,
}: SummaryCardsProps) {
  const items = [
    { label: "Referral sales", value: formatRand(referralSales), tone: "money" as const },
    { label: "Referrals", value: referrals.toLocaleString("en-ZA"), tone: "ink" as const },
    { label: "Active referrers", value: activeReferrers.toLocaleString("en-ZA"), tone: "ink" as const },
    { label: "Rewards owed", value: formatRand(rewardsOwed), tone: "brand" as const },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {items.map((item) => (
        <Card key={item.label} className="p-4 lg:p-5">
          <p className="text-[13px] text-ink-muted">{item.label}</p>
          <p
            className={`mt-1.5 font-display text-[26px] font-semibold leading-none tabular lg:text-[30px] ${
              item.tone === "money"
                ? "text-money-text"
                : item.tone === "brand"
                ? "text-brand-text"
                : "text-ink"
            }`}
          >
            {item.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
