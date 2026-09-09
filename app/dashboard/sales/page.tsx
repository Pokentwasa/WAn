"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppData } from "@/lib/store";
import { formatDate, formatRand } from "@/lib/utils";
import type { SaleStatus } from "@/lib/types";

const STATUS_CONFIG: Record<SaleStatus, { label: string; variant: "money" | "pending" | "clay" }> = {
  paid: { label: "Paid", variant: "money" },
  awaiting_payment: { label: "Awaiting payment", variant: "pending" },
  cancelled: { label: "Cancelled", variant: "clay" },
};

export default function SalesPage() {
  const { state } = useAppData();
  const [filter, setFilter] = useState<"all" | SaleStatus>("all");

  const sales = useMemo(() => {
    const sorted = [...state.referralSales].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return filter === "all" ? sorted : sorted.filter((s) => s.status === filter);
  }, [state.referralSales, filter]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Sales</h1>
        <p className="mt-1 text-sm text-ink-muted">Every sale a referral has brought in.</p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="awaiting_payment">Awaiting payment</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="p-1 sm:p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Referrer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Platform fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => {
              const status = STATUS_CONFIG[sale.status];
              return (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium text-ink">{sale.customerName}</TableCell>
                  <TableCell className="text-ink-muted">
                    {sale.referrerName ?? "\u2014"}
                  </TableCell>
                  <TableCell className="tabular">{formatRand(sale.amount)}</TableCell>
                  <TableCell className="tabular text-brand-text">
                    {sale.referrerId ? formatRand(sale.rewardAmount) : "\u2014"}
                  </TableCell>
                  <TableCell className="tabular text-ink-muted">
                    {sale.status === "paid" ? formatRand(sale.platformFeeAmount) : "\u2014"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant} dot>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-ink-muted">{formatDate(sale.createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {sales.length === 0 && (
          <p className="py-12 text-center text-sm text-ink-muted">No sales in this view yet.</p>
        )}
      </Card>
    </div>
  );
}
