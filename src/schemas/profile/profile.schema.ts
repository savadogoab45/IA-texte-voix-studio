import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2).max(80),
  image: z.string().url().optional().or(z.literal(""))
});
