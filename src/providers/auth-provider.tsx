"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
