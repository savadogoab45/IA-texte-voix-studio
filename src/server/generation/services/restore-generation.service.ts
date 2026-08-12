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

  async execute(userId: string, generationId: string): Promise<GenerationDto> {
    const generation = await this.generationRepository.findById(generationId);

    if (!generation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Génération introuvable.",
      });
    }
    if (!generation.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cette génération n'est pas supprimée.",
      });
    }
    const document = await this.documentRepository.findById(
      generation.documentId,
    );

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

    const restoredGeneration = await this.generationRepository.restore(
      generation.id,
    );

    return GenerationMapper.toDto(restoredGeneration);
  }
}
