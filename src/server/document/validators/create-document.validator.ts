import { z } from "zod";

export const CreateDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Le titre est obligatoire")
    .max(255, "Le titre est trop long"),

  content: z.string().optional(),

  projectId: z.string().min(1, "Le projet est obligatoire"),
});

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;
