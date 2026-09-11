import { TRPCError } from "@trpc/server";

import type { GenerationDto } from "../dtos/generation.dto";
import { GenerationMapper } from "../mappers/generation.mapper";
import type { GenerationRepository } from "../repositories/generation.repository";

import type { DocumentRepository } from "../../document/repositories/document.repository";
import type { ProjectRepository } from "../../project/repositories/project.repository";

export class RestoreGenerationService {
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(
    userId: string,
    generationId: string,
  ): Promise<GenerationDto> {
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
    // 2. Vérifier que la génération est supprimée
    // =========================================================

    if (!generation.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cette génération n'est pas supprimée.",
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
    // 5. Le projet doit être actif
    // =========================================================

    if (project.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Le projet est supprimé. Vous devez d'abord restaurer le projet.",
      });
    }

    // =========================================================
    // 6. Le document doit être actif
    // =========================================================

    if (document.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Le document est supprimé. Vous devez d'abord restaurer le document.",
      });
    }

    // =========================================================
    // 7. Restaurer la génération
    // =========================================================

    const restoredGeneration =
      await this.generationRepository.restore(
        generation.id,
      );

    // =========================================================
    // 8. Retourner le DTO
    // =========================================================

    return GenerationMapper.toDto(restoredGeneration);
  }
}