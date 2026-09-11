import { TRPCError } from "@trpc/server";

import type { DocumentRepository } from "../repositories/document.repository";
import type { ProjectRepository } from "@/server/project/repositories/project.repository";

export class HardDeleteDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, documentId: string) {
    const document = await this.documentRepository.findByIdIncludingDeleted(documentId);

    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document introuvable.",
      });
    }

    const project = await this.projectRepository.findByIdAndUserId(document.projectId, userId);

    if (!project) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Accès refusé.",
      });
    }

    return this.documentRepository.hardDelete(documentId);
  }
}