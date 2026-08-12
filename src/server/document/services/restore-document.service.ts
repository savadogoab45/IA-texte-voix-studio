import { TRPCError } from "@trpc/server";

import type { ProjectRepository } from "@/server/project/repositories/project.repository";

import { DocumentMapper } from "../mappers/document.mapper";
import type { DocumentRepository } from "../repositories/document.repository";

export class RestoreDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, documentId: string) {
    // Vérifier que le document existe
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Le document n'existe pas.",
      });
    }

    // Vérifier que le projet appartient à l'utilisateur
    const project = await this.projectRepository.findByIdAndUserId(
      document.projectId,
      userId,
    );

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Le projet n'existe pas ou ne vous appartient pas.",
      });
    }

    // Vérifier que le document est bien supprimé
    if (!document.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Le document est déjà actif.",
      });
    }

    // Restaurer le document
    const restoredDocument = await this.documentRepository.restore(documentId);

    // Retourner le DTO
    return DocumentMapper.toDto(restoredDocument);
  }
}
