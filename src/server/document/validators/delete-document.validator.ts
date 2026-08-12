import { z } from "zod";

export const DeleteDocumentSchema = z.object({
  documentId: z.string().min(1),
});

export type DeleteDocumentInput = z.infer<typeof DeleteDocumentSchema>;
