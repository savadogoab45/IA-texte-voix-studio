import { TRPCError } from "@trpc/server";

import type { ProjectRepository } from "@/server/project/repositories/project.repository";

import { DocumentMapper } from "../mappers/document.mapper";
import type { DocumentRepository } from "../repositories/document.repository";

export class GetAllDocumentsService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, projectId: string) {
    // Vérifier que le projet existe et appartient à l'utilisateur
    const project = await this.projectRepository.findByIdAndUserId(
      projectId,
      userId,
    );

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Le projet n'existe pas ou ne vous appartient pas.",
      });
    }

    // Récupérer tous les documents du projet
    const documents = await this.documentRepository.findByProjectId(projectId);

    // Retourner la liste des DTO
    return documents.map((document) => DocumentMapper.toDto(document));
  }
}
