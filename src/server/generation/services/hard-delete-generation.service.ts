import { TRPCError } from "@trpc/server";

import type { GenerationRepository } from "../repositories/generation.repository";
import type { DocumentRepository } from "@/server/document/repositories/document.repository";
import type { ProjectRepository } from "@/server/project/repositories/project.repository";

export class HardDeleteGenerationService {
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(
    userId: string,
    generationId: string,
  ) {
    // =========================================================
    // 1. Vérifier que la génération existe
    // =========================================================

    const generation =
      await this.generationRepository.findByIdIncludingDeleted(
        generationId,
      );

    if (!generation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Génération introuvable.",
      });
    }

    // =========================================================
    // 2. Vérifier que la génération est dans la corbeille
    // =========================================================

    if (!generation.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "La génération doit être supprimée avant de pouvoir être supprimée définitivement.",
      });
    }

    // =========================================================
    // 3. Vérifier que le document existe
    // =========================================================

    const document =
      await this.documentRepository.findByIdIncludingDeleted(
        generation.documentId,
      );

    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document introuvable.",
      });
    }

    // =========================================================
    // 4. Vérifier que le projet appartient à l'utilisateur
    // =========================================================

    const project =
      await this.projectRepository.findByIdAndUserIdIncludingDeleted(
        document.projectId,
        userId,
      );

    if (!project) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Accès refusé.",
      });
    }

    // =========================================================
    // 5. Suppression définitive
    // =========================================================

    return this.generationRepository.hardDelete(
      generationId,
    );
  }
}