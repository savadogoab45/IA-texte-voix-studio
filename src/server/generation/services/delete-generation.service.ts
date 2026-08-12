import { TRPCError } from "@trpc/server";

import type { GenerationDto } from "../dtos/generation.dto";
import { GenerationMapper } from "../mappers/generation.mapper";
import { GenerationRepository } from "../repositories/generation.repository";

import { DocumentRepository } from "../../document/repositories/document.repository";
import { ProjectRepository } from "../../project/repositories/project.repository";

export class DeleteGenerationService {
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, id: string): Promise<GenerationDto> {
    const generation = await this.generationRepository.findById(id);

    if (!generation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Génération introuvable.",
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

    const deletedGeneration = await this.generationRepository.softDelete(
      generation.id,
    );

    return GenerationMapper.toDto(deletedGeneration);
  }
}
