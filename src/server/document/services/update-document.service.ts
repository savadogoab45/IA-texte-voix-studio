import { TRPCError } from "@trpc/server";

import type { ProjectRepository } from "@/server/project/repositories/project.repository";

import { DocumentMapper } from "../mappers/document.mapper";
import type { DocumentRepository } from "../repositories/document.repository";

export class UpdateDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(
    userId: string,
    documentId: string,
    data: {
      title?: string;
      content?: string;
    },
  ) {
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

    // Vérifier qu'il n'existe pas déjà un autre document avec le même titre
    if (data.title) {
      const existingDocument =
        await this.documentRepository.findByProjectIdAndTitleExceptDocument(
          document.projectId,
          documentId,
          data.title,
        );

      if (existingDocument) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Un document portant ce titre existe déjà dans ce projet.",
        });
      }
    }

    // Mettre à jour le document
    const updatedDocument = await this.documentRepository.update(
      documentId,
      data,
    );

    // Retourner le DTO
    return DocumentMapper.toDto(updatedDocument);
  }
}
