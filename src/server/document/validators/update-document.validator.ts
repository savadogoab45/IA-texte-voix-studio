import { z } from "zod";

export const UpdateDocumentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(255),
  content: z.string(),
});

export type UpdateDocumentInput = z.infer<typeof UpdateDocumentSchema>;
