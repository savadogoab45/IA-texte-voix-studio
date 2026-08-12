import { TRPCError } from "@trpc/server";

import type { GenerationDto } from "../dtos/generation.dto";
import { GenerationMapper } from "../mappers/generation.mapper";
import { GenerationRepository } from "../repositories/generation.repository";

import { DocumentRepository } from "../../document/repositories/document.repository";
import { ProjectRepository } from "../../project/repositories/project.repository";

export class GetAllGenerationService {
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, documentId: string): Promise<GenerationDto[]> {
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document introuvable.",
      });
    }

    const project = await this.projectRepository.findByIdAndUserId(
      document.projectId,
      userId,
    );

    if (!project) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Accès refusé.",
      });
    }

    const generations = await this.generationRepository.findByDocumentId(
      document.id,
    );

    return generations.map((generation) => GenerationMapper.toDto(generation));
  }
}
