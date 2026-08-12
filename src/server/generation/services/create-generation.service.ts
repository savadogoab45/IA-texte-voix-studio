import { GenerationStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import type { GenerationDto } from "../dtos/generation.dto";
import { GenerationMapper } from "../mappers/generation.mapper";
import type { GenerationRepository } from "../repositories/generation.repository";

import type { CreateGenerationInput } from "../validators/create-generation.validator";

import { DocumentRepository } from "../../document/repositories/document.repository";
import { ProjectRepository } from "../../project/repositories/project.repository";
import { GenerationQueueService } from "../../queue/services/generation-queue.service";

export class CreateGenerationService {
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly generationQueueService: GenerationQueueService,
  ) {}

  async execute(
    userId: string,
    data: CreateGenerationInput,
  ): Promise<GenerationDto> {
    // Vérifier que le document existe
    const document = await this.documentRepository.findById(data.documentId);

    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document introuvable.",
      });
    }

    // Vérifier que le projet appartient à l'utilisateur
    const project = await this.projectRepository.findByIdAndUserId(
      document.projectId,
      userId,
    );

    if (!project) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Vous n'avez pas accès à ce document.",
      });
    }

    // Vérifier qu'aucune génération n'est déjà en cours
    const existingGeneration =
      await this.generationRepository.findByDocumentIdAndStatus(
        document.id,
        GenerationStatus.RUNNING,
      );

    if (existingGeneration) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Une génération est déjà en cours.",
      });
    }

    // Création de la génération
    const generation = await this.generationRepository.create({
      title: data.title,
      prompt: data.prompt,
      provider: data.provider,

      status: GenerationStatus.PENDING,
      document: {
        connect: {
          id: data.documentId,
        },
      },
      voice: {
        connect: {
          id: data.voiceId,
        },
      },
    });

    // Ajout du job dans BullMQ
    await this.generationQueueService.dispatchGeneration(generation.id);

    // Retour immédiat
    return GenerationMapper.toDto(generation);
  }
}
