import { db } from "@/server/db";

type GetDashboardStatsInput = {
  userId: string;
};

export async function getDashboardStats(
  input: GetDashboardStatsInput,
) {
  const { userId } = input;

  // Les statistiques sont regroupées dans une transaction afin d'éviter
  // de lancer 6 connexions Prisma simultanément.
  const [projectsCount, documentsCount, generationsCount, generationGroups] =
    await db.$transaction([
      db.project.count({
        where: {
          userId,
          deletedAt: null,
          isArchived: false,
        },
      }),

      db.document.count({
        where: {
          deletedAt: null,
          project: {
            userId,
            deletedAt: null,
            isArchived: false,
          },
        },
      }),

      db.generation.count({
        where: {
          deletedAt: null,
          document: {
            project: {
              userId,
              deletedAt: null,
              isArchived: false,
            },
          },
        },
      }),

      db.generation.groupBy({
        by: ["status"],
        where: {
          deletedAt: null,
          document: {
            project: {
              userId,
              deletedAt: null,
              isArchived: false,
            },
          },
        },
        orderBy: {
          status: "asc",
        },
        _count: {
          _all: true,
        },
      }),
    ]);

  const completedGenerationsCount =
    generationGroups.find(
      (group) => group.status === "COMPLETED",
    )?._count?._all ?? 0;

  const runningGenerationsCount =
    generationGroups.find(
      (group) => group.status === "RUNNING",
    )?._count?._all ?? 0;

  const failedGenerationsCount =
    generationGroups.find(
      (group) => group.status === "FAILED",
    )?._count?._all ?? 0;

  return {
    projects: projectsCount,
    documents: documentsCount,
    generations: generationsCount,
    completedGenerations: completedGenerationsCount,
    runningGenerations: runningGenerationsCount,
    failedGenerations: failedGenerationsCount,
  };
}
