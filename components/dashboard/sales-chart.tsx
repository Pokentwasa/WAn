"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatRand } from "@/lib/utils";

export interface SalesChartPoint {
  label: string;
  amount: number;
}

export function SalesChart({ data }: { data: SalesChartPoint[] }) {
  return (
    <div className="h-56 w-full lg:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C6790C" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#C6790C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#E8E1D3" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7A7265", fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7A7265", fontSize: 12 }}
            tickFormatter={(v) => (v === 0 ? "R0" : `R${Math.round(v / 1000)}k`)}
            width={44}
          />
          <Tooltip
            formatter={(value: number) => [formatRand(value), "Referral sales"]}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #E8E1D3",
              fontSize: 13,
              boxShadow: "0 4px 16px rgba(32,30,27,0.08)",
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#C6790C"
            strokeWidth={2}
            fill="url(#salesFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
