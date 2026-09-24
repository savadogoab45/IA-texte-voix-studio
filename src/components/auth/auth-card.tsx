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
        rounded-[20px]
        border
        border-blue-100/90
        bg-white/90
        shadow-[0_24px_70px_rgba(55,105,180,0.16)]
        backdrop-blur-xl
        dark:border-cyan-300/35
        dark:bg-[#06142e]/80
        dark:shadow-[0_0_70px_rgba(37,99,235,0.18)]
      "
    >
      <CardContent
        className="
          px-5
          py-6
          sm:px-8
          sm:py-7
        "
      >
        {children}
      </CardContent>
    </Card>
  );
}
