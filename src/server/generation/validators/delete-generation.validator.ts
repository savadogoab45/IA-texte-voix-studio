import { z } from "zod";

export const DeleteGenerationSchema = z.object({
  id: z.string().min(1),
});

export type DeleteGenerationInput = z.infer<typeof DeleteGenerationSchema>;
