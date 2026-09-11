import { TRPCError } from "@trpc/server";

import type { GenerationDto } from "../dtos/generation.dto";
import { GenerationMapper } from "../mappers/generation.mapper";
import type { GenerationRepository } from "../repositories/generation.repository";

export class GetGenerationService {
  constructor(
    private readonly generationRepository: GenerationRepository,
  ) {}

  async execute(
    generationId: string,
  ): Promise<GenerationDto> {
    const generation =
      await this.generationRepository.findById(
        generationId,
      );

    if (!generation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Génération introuvable.",
      });
    }

    return GenerationMapper.toDto(
      generation,
    );
  }
}