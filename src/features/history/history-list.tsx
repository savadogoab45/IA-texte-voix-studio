"use client";

import { api } from "@/trpc/react";
import { formatDate } from "@/lib/format";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@/components/ui";

export function HistoryList() {
  const history = api.generation.getAllMine.useQuery();

  if (history.isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (!history.data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucune generation</CardTitle>
          <CardDescription>Vos contenus apparaitront ici.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {history.data.map((item: { id: string; title: string; createdAt: Date; prompt: string; result: string | null; }) => (
        <Card key={item.id}>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{formatDate(item.createdAt)}</CardDescription>
            </div>
            <Badge>{item.result ? "OK" : "PENDING"}</Badge>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-sm text-muted-foreground">{item.result ?? item.prompt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
