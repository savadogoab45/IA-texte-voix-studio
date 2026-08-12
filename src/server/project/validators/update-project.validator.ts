import { z } from "zod";

// La classe UpdateProjectValidator est responsable de la validation des données fournies pour la mise à jour d'un projet. Elle contient une méthode statique validate qui vérifie si au moins un champ (name ou description) est fourni pour la mise à jour. Si aucun champ n'est fourni, elle lance une erreur TRPCError avec le code "BAD_REQUEST" et un message approprié.
export const UpdateProjectSchema = z
  .object({
    projectId: z.string().min(1),
    name: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "Au moins un champ doit être modifié.",
  });

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
