import { z } from "zod";

export const GetGenerationSchema = z.object({
  id: z.string().min(1),
});

export type GetGenerationInput = z.infer<typeof GetGenerationSchema>;
