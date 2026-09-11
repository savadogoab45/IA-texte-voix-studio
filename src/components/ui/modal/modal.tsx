import * as React from "react";

import { cn } from "@/lib/cn";

export function Modal({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm">
      <div className={cn("w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg", className)} {...props} />
    </div>
  );
}
