import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-medium leading-none",
  {
    variants: {
      variant: {
        neutral: "bg-black/5 text-ink-muted",
        money: "bg-money-tint text-money-text",
        pending: "bg-brand-tint text-brand-text",
        clay: "bg-clay-tint text-clay-text",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "money" && "bg-money",
            variant === "pending" && "bg-brand",
            variant === "clay" && "bg-clay",
            variant === "neutral" && "bg-ink-faint"
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
