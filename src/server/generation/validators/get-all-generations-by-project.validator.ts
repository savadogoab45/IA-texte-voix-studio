import { z } from "zod";

export const GetAllGenerationsByProjectSchema = z.object({
  projectId: z.string().min(1),
});