"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppData } from "@/lib/store";
import { formatDateTime, formatRand } from "@/lib/utils";

export default function PaymentsPage() {
  const { state } = useAppData();

  const referrerName = (id: string | null) =>
    id ? state.referrers.find((r) => r.id === id)?.name ?? "\u2014" : "\u2014";

  const pending = useMemo(
    () =>
      state.paymentRequests
        .filter((p) => p.status === "pending")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [state.paymentRequests]
  );

  const successful = useMemo(
    () =>
      state.payments
        .filter((p) => p.status === "successful")
        .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()),
    [state.payments]
  );

  const failed = useMemo(
    () =>
      state.payments
        .filter((p) => p.status === "failed")
        .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()),
    [state.payments]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Payments</h1>
        <p className="mt-1 text-sm text-ink-muted">Payments processed securely by Yoco.</p>
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Payment requests ({pending.length})</TabsTrigger>
          <TabsTrigger value="successful">Successful ({successful.length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({failed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card className="p-1 sm:p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Referral</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-ink">{p.id}</TableCell>
                    <TableCell>{p.customerName}</TableCell>
                    <TableCell className="tabular">{formatRand(p.amount)}</TableCell>
                    <TableCell className="text-ink-muted">{referrerName(p.referrerId)}</TableCell>
                    <TableCell>
                      <Badge variant="pending" dot>
                        Awaiting payment
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/pay/${p.id}`}>
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pending.length === 0 && (
              <p className="py-12 text-center text-sm text-ink-muted">
                No open payment requests.
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="successful">
          <Card className="p-1 sm:p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Processed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {successful.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-ink">
                      {p.paymentRequestId}
                    </TableCell>
                    <TableCell className="tabular">{formatRand(p.amount)}</TableCell>
                    <TableCell className="text-ink-muted">{methodLabel(p.method)}</TableCell>
                    <TableCell className="text-ink-muted">
                      {formatDateTime(p.processedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="money" dot>
                        Successful
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {successful.length === 0 && (
              <p className="py-12 text-center text-sm text-ink-muted">
                No successful payments yet.
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card className="p-1 sm:p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Processed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failed.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-ink">
                      {p.paymentRequestId}
                    </TableCell>
                    <TableCell className="tabular">{formatRand(p.amount)}</TableCell>
                    <TableCell className="text-ink-muted">{methodLabel(p.method)}</TableCell>
                    <TableCell className="text-ink-muted">
                      {formatDateTime(p.processedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="clay" dot>
                        Failed
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {failed.length === 0 && (
              <p className="py-12 text-center text-sm text-ink-muted">No failed payments.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function methodLabel(method: string): string {
  if (method === "card") return "Card";
  if (method === "apple_pay") return "Apple Pay";
  if (method === "google_pay") return "Google Pay";
  return method;
}
