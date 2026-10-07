import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1c2024] text-white shadow-xs hover:bg-[#2c3238]",
        yellow:
          "border-transparent bg-[#ffcf36] text-[#1c2024] shadow-xs font-bold hover:bg-[#f5be24]",
        secondary:
          "border-transparent bg-[#f0ede5] text-[#1c2024] hover:bg-[#e4e0d6]",
        destructive:
          "border-transparent bg-red-100 text-red-800 border-red-200 shadow-xs",
        outline: "border-black/15 text-[#1c2024] bg-white/60",
        success:
          "border-transparent bg-[#EBF7D5] text-[#749c36] shadow-xs font-semibold",
        warning:
          "border-transparent bg-[#ffcf36]/25 text-[#925f05] border-[#ffcf36]/50 shadow-xs",
        info:
          "border-transparent bg-sky-100 text-sky-800 border-sky-200 shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
