import { z } from "zod";

export const GetAllDocumentsSchema = z.object({
  projectId: z.cuid(),
});

export type GetAllDocumentsInput = z.infer<typeof GetAllDocumentsSchema>;
