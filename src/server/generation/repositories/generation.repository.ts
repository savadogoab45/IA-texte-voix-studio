import { db } from "@/server/db";

import type { Generation, GenerationStatus, Prisma } from "@prisma/client";

export class GenerationRepository {
  async create(data: Prisma.GenerationCreateInput): Promise<Generation> {
    return db.generation.create({
      data,
    });
  }

  async findById(id: string): Promise<Generation | null> {
    return db.generation.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByDocumentId(documentId: string): Promise<Generation[]> {
    return db.generation.findMany({
      where: {
        documentId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByDocumentIdAndStatus(
    documentId: string,
    status: GenerationStatus,
  ): Promise<Generation | null> {
    return db.generation.findFirst({
      where: {
        documentId,
        status,
        deletedAt: null,
      },
    });
  }

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

  async softDelete(id: string): Promise<Generation> {
    return db.generation.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: string): Promise<Generation> {
    return db.generation.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });
  }

  async updateProgress(id: string, progress: number, currentStep: string) {
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
}
