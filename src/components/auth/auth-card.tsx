import type { ReactNode } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({
  children,
}: Readonly<AuthCardProps>) {
  return (
    <Card
      className="
        w-full
        max-w-[430px]
        rounded-3xl
        border-border/60
        shadow-2xl
      "
    >
      <CardContent
        className="
          px-8
          py-7
        "
      >
        {children}
      </CardContent>
    </Card>
  );
}