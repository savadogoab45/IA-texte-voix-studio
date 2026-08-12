import { z } from "zod";

export const RestoreDocumentSchema = z.object({
  documentId: z.string().min(1),
});

export type RestoreDocumentInput = z.infer<typeof RestoreDocumentSchema>;
