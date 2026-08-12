import { z } from "zod";

export const GetProjectSchema = z.object({
  projectId: z.string().min(1),
});

export type GetProjectInput = z.infer<typeof GetProjectSchema>;
