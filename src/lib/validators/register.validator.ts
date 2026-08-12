import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères.")
      .max(100),

    email: z
      .email("Adresse email invalide.")
      .trim(),

    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Les mots de passe ne correspondent pas.",
    },
  );

export type RegisterInput = z.infer<typeof RegisterSchema>;