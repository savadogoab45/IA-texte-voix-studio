import { DashboardShell } from "@/components/layout/dashboard-shell";
import { HistoryList } from "@/features/history/history-list";
import { requireSession } from "@/server/auth/middleware";

export default async function HistoryPage() {
  await requireSession("/dashboard/history");

  return (
    <DashboardShell>
      <div className="grid gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Historique</h2>
          <p className="text-muted-foreground">Retrouvez vos generations texte et audio.</p>
        </div>
        <HistoryList />
      </div>
    </DashboardShell>
  );
}
