import { z } from "zod";

export const RetryGenerationSchema = z.object({
  id: z.cuid2(),
});

export type RetryGenerationInput = z.infer<
  typeof RetryGenerationSchema
>;