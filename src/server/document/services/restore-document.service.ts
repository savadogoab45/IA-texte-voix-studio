import { TRPCError } from "@trpc/server";

import { DocumentMapper } from "../mappers/document.mapper";
import type { DocumentRepository } from "../repositories/document.repository";
import type { ProjectRepository } from "@/server/project/repositories/project.repository";

export class RestoreDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(
    userId: string,
    documentId: string,
  ) {
    // =========================================================
    // 1. Vérifier que le document existe
    // =========================================================

    const document =
      await this.documentRepository.findByIdIncludingDeleted(
        documentId,
      );

    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Le document n'existe pas.",
      });
    }

    // =========================================================
    // 2. Vérifier que le document est supprimé
    // =========================================================

    if (!document.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Le document est déjà actif.",
      });
    }

    // =========================================================
    // 3. Vérifier que le projet existe
    //    et appartient à l'utilisateur
    // =========================================================

    const project =
      await this.projectRepository.findByIdAndUserIdIncludingDeleted(
        document.projectId,
        userId,
      );

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Le projet n'existe pas ou ne vous appartient pas.",
      });
    }

    // =========================================================
    // 4. Le projet doit être actif
    //
    // Si le document a été supprimé avec le projet,
    // l'utilisateur doit restaurer le projet d'abord.
    // =========================================================

    if (project.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Le projet est supprimé. Vous devez d'abord restaurer le projet.",
      });
    }

    // =========================================================
    // 5. Restaurer le document
    //
    // Le repository restaurera également les générations
    // supprimées avec ce document.
    // =========================================================

    const restoredDocument =
      await this.documentRepository.restore(
        documentId,
      );

    // =========================================================
    // 6. Retourner le DTO
    // =========================================================

    return DocumentMapper.toDto(restoredDocument);
  }
}