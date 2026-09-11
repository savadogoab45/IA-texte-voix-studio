import { z } from "zod";

export const generateTextSchema = z.object({
  title: z.string().min(2).max(120),
  prompt: z.string().min(10).max(8000),
  model: z.string().default("gpt-4.1-mini")
});

export type GenerateTextInput = z.infer<typeof generateTextSchema>;
