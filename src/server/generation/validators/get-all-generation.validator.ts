import { z } from "zod";

export const GetAllGenerationSchema = z.object({
  documentId: z.string().min(1),
});

export type GetAllGenerationInput = z.infer<typeof GetAllGenerationSchema>;
