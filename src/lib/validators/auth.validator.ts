import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères"),

    email: z
      .email("Adresse e-mail invalide"),

    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    }
  );

export type RegisterSchema = z.infer<typeof registerSchema>;