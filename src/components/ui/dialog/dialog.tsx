import * as React from "react";

import { cn } from "@/lib/cn";

export function Dialog({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-border bg-card p-6 shadow-sm", className)} {...props} />;
}
