import { Badge } from "@/components/ui/badge";
import { formatRand, relativeTime } from "@/lib/utils";
import type { ReferralSale } from "@/lib/types";

const STATUS_CONFIG = {
  paid: { label: "Paid", variant: "money" as const },
  awaiting_payment: { label: "Awaiting payment", variant: "pending" as const },
  cancelled: { label: "Cancelled", variant: "clay" as const },
};

export function ActivityFeed({ sales }: { sales: ReferralSale[] }) {
  if (sales.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-muted">
        No referral sales yet - share a referral link to get started.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {sales.map((sale) => {
        const status = STATUS_CONFIG[sale.status];
        return (
          <li key={sale.id} className="flex items-center justify-between gap-3 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {sale.referrerName ? (
                  <>
                    {sale.referrerName} referred {sale.customerName}
                  </>
                ) : (
                  <>Direct sale to {sale.customerName}</>
                )}
              </p>
              <p className="mt-0.5 text-[13px] text-ink-muted">
                {formatRand(sale.amount)} sale &middot; {relativeTime(sale.createdAt)}
              </p>
            </div>
            <Badge variant={status.variant} dot>
              {status.label}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
