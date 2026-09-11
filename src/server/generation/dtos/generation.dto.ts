import type {
  AIProviderType,
  GenerationStatus,
  VoiceProviderType,
} from "@prisma/client";

export interface GenerationVoiceDto {
  id: string;

  name: string;

  provider: VoiceProviderType;

  providerVoiceId: string;

  language: string;

  gender: string | null;
}

export interface GenerationDto {
  id: string;

  title: string;

  prompt: string;

  status: GenerationStatus;

  providerAi: AIProviderType | null;

  providerVoice: VoiceProviderType | null;

  result: string | null;

  error: string | null;

  voiceId: string | null;

  voice: GenerationVoiceDto | null;

  audioUrl: string | null;

  duration: number | null;

  progress: number;

  currentStep: string | null;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;

  transcript: string | null;

  documentId: string;

  previewUrl: string | null;
}

export interface GenerationWithDocumentDto extends GenerationDto {
  document: {
    id: string;
    title: string;
    project: {
      id: string;
      name: string;
    };
  };
}