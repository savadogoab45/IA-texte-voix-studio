import { db } from "@/server/db";

type GetDashboardStatsInput = {
  userId: string;
};

export async function getDashboardStats(
  input: GetDashboardStatsInput,
) {
  const { userId } = input;

  const [
    projectsCount,
    documentsCount,
    generationsCount,
    completedGenerationsCount,
    runningGenerationsCount,
    failedGenerationsCount,
  ] = await Promise.all([
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
          },
        },
      },
    }),

    db.generation.count({
      where: {
        deletedAt: null,
        status: "COMPLETED",
        document: {
          project: {
            userId,
            deletedAt: null,
          },
        },
      },
    }),

    db.generation.count({
      where: {
        deletedAt: null,
        status: "RUNNING",
        document: {
          project: {
            userId,
            deletedAt: null,
          },
        },
      },
    }),

    db.generation.count({
      where: {
        deletedAt: null,
        status: "FAILED",
        document: {
          project: {
            userId,
            deletedAt: null,
          },
        },
      },
    }),
  ]);

  return {
    projects: projectsCount,
    documents: documentsCount,
    generations: generationsCount,
    completedGenerations: completedGenerationsCount,
    runningGenerations: runningGenerationsCount,
    failedGenerations: failedGenerationsCount,
  };
}