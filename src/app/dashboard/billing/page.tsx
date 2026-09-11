import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { requireSession } from "@/server/auth/middleware";

export default async function BillingPage() {
  await requireSession("/dashboard/billing");

  return (
    <DashboardShell>
      <div className="grid max-w-3xl gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Facturation</h2>
          <p className="text-muted-foreground">Plans, credits et abonnements.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Plan actuel</CardTitle>
            <CardDescription>Le modele Prisma est pret pour connecter Stripe ou un autre prestataire.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardShell>
  );
}
