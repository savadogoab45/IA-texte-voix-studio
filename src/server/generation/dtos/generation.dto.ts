import type { AIProviderType, GenerationStatus } from "@prisma/client";

export interface GenerationDto {
  id: string;
  prompt: string;
  title: string;
  status: GenerationStatus;
  provider: AIProviderType;
  result: string | null;
  error: string | null;
  voiceId: string | null;
  audioUrl: string | null;
  progress: number;
  currentStep: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  transcript: string | null;
  documentId: string;
}
