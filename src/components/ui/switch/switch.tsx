import * as React from "react";

import { cn } from "@/lib/cn";

export const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn("h-5 w-9 rounded-full accent-primary", className)}
      {...props}
    />
  )
);

Switch.displayName = "Switch";
