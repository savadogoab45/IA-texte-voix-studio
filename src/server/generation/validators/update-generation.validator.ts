import { AIProviderType, GenerationStatus } from "@prisma/client";
import { z } from "zod";

export const UpdateGenerationSchema = z.object({
  id: z.string().min(1),

  prompt: z.string().trim().min(1).max(5000).optional(),

  provider: z.enum(AIProviderType).optional(),

  status: z.enum(GenerationStatus).optional(),

  result: z.string().optional(),

  error: z.string().optional(),
});

export type UpdateGenerationInput = z.infer<typeof UpdateGenerationSchema>;
