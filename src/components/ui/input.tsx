import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-2xl border border-black/10 bg-white/90 px-3.5 py-2 text-sm text-[#1c2024] shadow-2xs transition-all placeholder:text-[#8e939f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcf36]/60 focus-visible:border-[#ffcf36] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
