"use client";

import { Button } from "@/components/ui";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div className="grid max-w-md gap-4">
        <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
        <p className="text-muted-foreground">Rechargez la page ou revenez au tableau de bord.</p>
        <Button onClick={reset}>Reessayer</Button>
      </div>
    </div>
  );
}
