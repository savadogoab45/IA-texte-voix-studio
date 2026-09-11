import { db } from "@/server/db";

import type {
  Generation,
  GenerationStatus,
  Prisma,
  Voice,
} from "@prisma/client";

type GenerationWithVoice = Generation & {
  voice: Voice | null;
};

export class GenerationRepository {
  // =========================================================
  // CREATE
  // =========================================================

  async create(
    data: Prisma.GenerationCreateInput,
  ): Promise<Generation> {
    return db.generation.create({
      data,
    });
  }

  // =========================================================
  // FIND BY ID
  // =========================================================

  async findById(id: string) {
    return db.generation.findFirst({
      where: {
        id,
        deletedAt: null,

        document: {
          deletedAt: null,

          project: {
            deletedAt: null,
          },
        },
      },

      include: {
        voice: true,

        document: {
          select: {
            id: true,
            title: true,
            projectId: true,

            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  // =========================================================
  // FIND BY ID INCLUDING DELETED
  // =========================================================

  async findByIdIncludingDeleted(id: string) {
    return db.generation.findUnique({
      where: {
        id,
      },

      include: {
        voice: true,

        document: {
          select: {
            id: true,
            title: true,
            projectId: true,

            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  // =========================================================
  // FIND BY DOCUMENT
  // =========================================================

  async findByDocumentId(
    documentId: string,
  ): Promise<GenerationWithVoice[]> {
    return db.generation.findMany({
      where: {
        documentId,
        deletedAt: null,

        document: {
          deletedAt: null,

          project: {
            deletedAt: null,
          },
        },
      },

      include: {
        voice: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =========================================================
  // FIND BY DOCUMENT + STATUS
  // =========================================================

  async findByDocumentIdAndStatus(
    documentId: string,
    status: GenerationStatus,
  ): Promise<GenerationWithVoice | null> {
    return db.generation.findFirst({
      where: {
        documentId,
        status,
        deletedAt: null,

        document: {
          deletedAt: null,

          project: {
            deletedAt: null,
          },
        },
      },

      include: {
        voice: true,
      },
    });
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    id: string,
    data: Prisma.GenerationUpdateInput,
  ): Promise<Generation> {
    return db.generation.update({
      where: {
        id,
      },

      data,
    });
  }

  // =========================================================
  // SOFT DELETE
  // =========================================================

  async softDelete(
    id: string,
  ): Promise<Generation> {
    return db.generation.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  // =========================================================
  // HARD DELETE
  // =========================================================

  async hardDelete(
    id: string,
  ): Promise<Generation> {
    return db.generation.delete({
      where: {
        id,
      },
    });
  }

  // =========================================================
  // RESTORE
  // =========================================================

  async restore(
    id: string,
  ): Promise<Generation> {
    return db.generation.update({
      where: {
        id,
      },

      data: {
        deletedAt: null,
      },
    });
  }

  // =========================================================
  // FIND BY PROJECT
  // =========================================================

  async findByProjectId(
    projectId: string,
  ): Promise<GenerationWithVoice[]> {
    return db.generation.findMany({
      where: {
        deletedAt: null,

        document: {
          projectId,
          deletedAt: null,

          project: {
            deletedAt: null,
          },
        },
      },

      include: {
        voice: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =========================================================
  // UPDATE PROGRESS
  // =========================================================

  async updateProgress(
    id: string,
    progress: number,
    currentStep: string,
  ) {
    return db.generation.update({
      where: {
        id,
      },

      data: {
        progress,
        currentStep,
      },
    });
  }

  // =========================================================
  // FIND ALL BY USER
  // =========================================================

  async findAllByUser(userId: string) {
    return db.generation.findMany({
      where: {
        deletedAt: null,

        document: {
          deletedAt: null,

          project: {
            userId,
            deletedAt: null,
          },
        },
      },

      include: {
        voice: true,

        document: {
          include: {
            project: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =========================================================
  // FIND DELETED BY USER
  // =========================================================

  async findDeletedByUser(userId: string) {
    return db.generation.findMany({
      where: {
        deletedAt: {
          not: null,
        },

        document: {
          project: {
            userId,
          },
        },
      },

      include: {
        voice: true,

        document: {
          include: {
            project: true,
          },
        },
      },

      orderBy: {
        deletedAt: "desc",
      },
    });
  }
}