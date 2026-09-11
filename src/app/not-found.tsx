import Link from "next/link";

import { buttonVariants } from "@/components/ui/button/button";
import { cn } from "@/lib/cn";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div className="grid max-w-md gap-4">
        <h1 className="text-2xl font-semibold">Page introuvable</h1>
        <p className="text-muted-foreground">La page demandee n'existe pas ou a ete deplacee.</p>
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/">
          Retour a l'accueil
        </Link>
      </div>
    </div>
  );
}
