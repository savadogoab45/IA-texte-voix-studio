import { VoiceProviderType, VoiceType } from "@prisma/client";
import { z } from "zod";

export const updateVoiceValidator = z.object({
  name: z.string().min(1).max(100).optional(),

  provider: z.nativeEnum(VoiceProviderType).optional(),

  providerVoiceId: z.string().optional(),

  type: z.nativeEnum(VoiceType).optional(),

  language: z.string().optional(),

  gender: z.string().optional(),

  description: z.string().optional(),

  isActive: z.boolean().optional(),
});

export type UpdateVoiceInput = z.infer<typeof updateVoiceValidator>;
