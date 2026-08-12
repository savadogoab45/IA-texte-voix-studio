import { z } from "zod";

export const RestoreGenerationSchema = z.object({
  id: z.string().min(1),
});

export type RestoreGenerationInput = z.infer<typeof RestoreGenerationSchema>;
