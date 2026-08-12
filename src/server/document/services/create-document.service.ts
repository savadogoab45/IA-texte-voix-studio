import { TRPCError } from "@trpc/server";

import type { ProjectRepository } from "@/server/project/repositories/project.repository";

import { DocumentMapper } from "../mappers/document.mapper";
import type { DocumentRepository } from "../repositories/document.repository";
import type { CreateDocumentInput } from "../validators/create-document.validator";

export class CreateDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, data: CreateDocumentInput) {
    // Vérifier que le projet existe et appartient à l'utilisateur
    const project = await this.projectRepository.findByIdAndUserId(
      data.projectId,
      userId,
    );

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Le projet n'existe pas ou ne vous appartient pas.",
      });
    }

    // Vérifier qu'un document portant le même titre n'existe pas déjà
    const existingDocument =
      await this.documentRepository.findByProjectIdAndTitle(
        data.projectId,
        data.title,
      );

    if (existingDocument) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Un document portant ce titre existe déjà dans ce projet.",
      });
    }

    // Créer le document
    const newDocument = await this.documentRepository.create(data.projectId, {
      title: data.title,
      content: data.content ?? "",
    });

    // Retourner le DTO
    return DocumentMapper.toDto(newDocument);
  }
}
