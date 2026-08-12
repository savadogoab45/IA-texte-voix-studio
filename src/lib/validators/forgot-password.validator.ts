import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Adresse e-mail invalide"),
});

export type ForgotPasswordSchema =
  z.infer<typeof forgotPasswordSchema>;