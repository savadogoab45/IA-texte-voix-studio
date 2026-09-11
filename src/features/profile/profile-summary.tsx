"use client";

import { api } from "@/trpc/react";
import { formatCredits } from "@/lib/format";
import { Avatar, Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@/components/ui";

export function ProfileSummary() {
  const me = api.project.getAll.useQuery();

  if (me.isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  const user = me.data?.[0];

  if (!user) return null;

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4">
        <Avatar name={user.name} className="h-12 w-12" />
        <div>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.description ?? "Projet"}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Projets</span>
          <span className="font-medium">{me.data?.length ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Créé</span>
          <span className="font-medium">{new Date(user.createdAt).toLocaleDateString("fr-FR")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
