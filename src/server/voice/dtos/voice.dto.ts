import { VoiceProviderType, VoiceType } from "@prisma/client";


export interface VoiceDto {
  id: string;

  name: string;

  provider: VoiceProviderType;

  providerVoiceId: string;

  type: VoiceType;

  language: string;

  gender: string | null;

  description: string | null;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}
