import { GenerationStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import type { GenerationDto } from "../dtos/generation.dto";
import { GenerationMapper } from "../mappers/generation.mapper";
import type { GenerationRepository } from "../repositories/generation.repository";

import type { DocumentRepository } from "../../document/repositories/document.repository";
import type { ProjectRepository } from "../../project/repositories/project.repository";
import { GenerationQueueService } from "../../queue/services/generation-queue.service";

export class RetryGenerationService {
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly generationQueueService: GenerationQueueService,
  ) { }

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

    const Notgeneration = generation.status === GenerationStatus.PENDING || generation.status === GenerationStatus.RUNNING

    if (Notgeneration) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cette génération est déjà en cours de traitement.",
      });
    }

    const updatedGeneration = await this.generationRepository.update(id, {
      status: GenerationStatus.PENDING,
      progress: 0,
      currentStep: "En attente",
      error: null,
      result: null,
      transcript: null,
      audioUrl: null,
      duration: null,
    });

    await this.generationQueueService.dispatchGeneration(updatedGeneration.id);

    return GenerationMapper.toDto(updatedGeneration);
  }
}