import { z } from "zod";

export const createAudioJobSchema = z.object({
  title: z.string().min(2).max(120),
  sourceText: z.string().min(10).max(8000),
  voice: z.string().default("alloy")
});

export type CreateAudioJobInput = z.infer<typeof createAudioJobSchema>;
