import { z } from "zod";

export const GetDocumentSchema = z.object({
  documentId: z.string().min(1),
});

export type GetDocumentInput = z.infer<typeof GetDocumentSchema>;
