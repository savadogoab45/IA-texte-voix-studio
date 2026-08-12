import { z } from "zod";

export const DeleteProjectSchema = z.object({
  projectId: z.string().min(1),
});

export type DeleteProjectInput = z.infer<typeof DeleteProjectSchema>;
