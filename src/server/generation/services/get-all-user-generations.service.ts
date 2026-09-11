import { TRPCError } from "@trpc/server";

import type { GenerationDto } from "../dtos/generation.dto";
import { GenerationMapper } from "../mappers/generation.mapper";
import type { GenerationRepository } from "../repositories/generation.repository";

export interface UserGenerationDto
  extends GenerationDto {
  document: {
    id: string;
    title: string;
    project: {
      id: string;
      name: string;
    };
  };
}

export class GetAllUserGenerationsService {
  constructor(
    private readonly generationRepository: GenerationRepository,
  ) {}

  async execute(
    userId: string,
  ): Promise<UserGenerationDto[]> {
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Utilisateur non authentifié.",
      });
    }

    const generations =
      await this.generationRepository.findAllByUser(userId);

    return generations.map((generation) => ({
      ...GenerationMapper.toDto(generation),

      document: {
        id: generation.document.id,
        title: generation.document.title,

        project: {
          id: generation.document.project.id,
          name: generation.document.project.name,
        },
      },
    }));
  }
}