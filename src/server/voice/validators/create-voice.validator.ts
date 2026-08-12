import { VoiceProviderType, VoiceType } from "@prisma/client";
import { z } from "zod";

export const createVoiceValidator = z.object({
  name: z.string().min(1).max(100),

  provider: z.nativeEnum(VoiceProviderType),

  providerVoiceId: z.string().min(1),

  type: z.nativeEnum(VoiceType),

  language: z.string().min(2).max(10),

  gender: z.string().optional(),

  description: z.string().optional(),
});

export type CreateVoiceInput = z.infer<typeof createVoiceValidator>;
