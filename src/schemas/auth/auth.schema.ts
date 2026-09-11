import { z } from "zod";

export const emailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const signUpSchema = emailPasswordSchema.extend({
  name: z.string().min(2).max(80)
});
