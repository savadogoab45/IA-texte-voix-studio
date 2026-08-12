import { z } from "zod";

export const RestoreProjectSchema = z.object({
  projectId: z.string().min(1),
});

export type RestoreProjectInput = z.infer<
  typeof RestoreProjectSchema
>;