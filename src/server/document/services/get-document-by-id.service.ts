import type { ProjectRepository } from "@/server/project/repositories/project.repository";
import type { DocumentRepository } from "../repositories/document.repository";
import { TRPCError } from "@trpc/server";
import { DocumentMapper } from "../mappers/document.mapper";

export class GetDocumentByIdService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, documentId: string) {
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Le document n'existe pas.",
      });
    }

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

    return DocumentMapper.toDto(document);
  }
}
