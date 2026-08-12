import { TRPCError } from "@trpc/server";

import type { GenerationDto } from "../dtos/generation.dto";
import { GenerationMapper } from "../mappers/generation.mapper";
import type { GenerationRepository } from "../repositories/generation.repository";

import type { UpdateGenerationInput } from "../validators/update-generation.validator";

import type { DocumentRepository } from "../../document/repositories/document.repository";
import type { ProjectRepository } from "../../project/repositories/project.repository";

export class UpdateGenerationService {
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(
    userId: string,
    generationId: string,
    data: Omit<UpdateGenerationInput, "id">,
  ): Promise<GenerationDto> {
    const generation = await this.generationRepository.findById(generationId);

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

    // Mise a jour
    const updatedGeneration = await this.generationRepository.update(
      generation.id,
      data,
    );

    return GenerationMapper.toDto(updatedGeneration);
  }
}
