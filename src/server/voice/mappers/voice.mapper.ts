import type { Voice } from "@prisma/client";

import type { VoiceDto } from "../dtos/voice.dto";

export class VoiceMapper {
  static toDto(voice: Voice): VoiceDto {
    return {
      id: voice.id,
      name: voice.name,
      provider: voice.provider,
      providerVoiceId: voice.providerVoiceId,
      type: voice.type,
      language: voice.language,
      gender: voice.gender,
      description: voice.description,
      isActive: voice.isActive,
      createdAt: voice.createdAt,
      updatedAt: voice.updatedAt,
    };
  }
}
