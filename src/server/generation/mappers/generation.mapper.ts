import type { Generation } from "@prisma/client";

import type { GenerationDto } from "../dtos/generation.dto";

export class GenerationMapper {
  static toDto(generation: Generation): GenerationDto {
    return {
      id: generation.id,
      prompt: generation.prompt,
      title: generation.title,
      provider: generation.provider,
      status: generation.status,
      result: generation.result,
      voiceId: generation.voiceId,
      audioUrl: generation.audioUrl,
      progress: generation.progress,
      currentStep: generation.currentStep,
      error: generation.error,
      createdAt: generation.createdAt,
      updatedAt: generation.updatedAt,
      deletedAt: generation.deletedAt,
      transcript: generation.transcript,
      documentId: generation.documentId,
    };
  }
}
