import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { requireSession } from "@/server/auth/middleware";

export default async function AnalyticsPage() {
  await requireSession("/dashboard/analytics");

  return (
    <DashboardShell>
      <div className="grid max-w-3xl gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Statistiques</h2>
          <p className="text-muted-foreground">Suivi des generations, credits et usages audio.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Vue usage</CardTitle>
            <CardDescription>Ajoutez ici vos graphiques depuis les tables `AiGeneration` et `AudioJob`.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardShell>
  );
}
