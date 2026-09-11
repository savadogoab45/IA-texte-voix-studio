import type {
  Generation,
  Voice,
} from "@prisma/client";

import type {
  GenerationDto,
  GenerationVoiceDto,
} from "../dtos/generation.dto";

type GenerationWithVoice =
  Generation & {
    voice?: Voice | null;
  };

export class GenerationMapper {
  static toDto(
    generation: GenerationWithVoice,
  ): GenerationDto {
    const voice: GenerationVoiceDto | null =
      generation.voice
        ? {
            id: generation.voice.id,

            name: generation.voice.name,

            provider:
              generation.voice.provider,

            providerVoiceId:
              generation.voice.providerVoiceId,

            language:
              generation.voice.language,

            gender:
              generation.voice.gender ??
              null,
          }
        : null;

    return {
      id: generation.id,

      title: generation.title,

      prompt: generation.prompt,

      providerAi:
        generation.providerAi ?? null,

      providerVoice:
        generation.providerVoice ?? null,

      status:
        generation.status,

      result:
        generation.result,

      error:
        generation.error,

      voiceId:
        generation.voiceId,

      voice,

      audioUrl:
        generation.audioUrl,

      duration:
        generation.duration ?? null,

      progress:
        generation.progress,

      currentStep:
        generation.currentStep,

      createdAt:
        generation.createdAt,

      updatedAt:
        generation.updatedAt,

      deletedAt:
        generation.deletedAt,

      transcript:
        generation.transcript,

      documentId:
        generation.documentId,

      previewUrl:
        generation.previewUrl ?? null,
    };
  }
}