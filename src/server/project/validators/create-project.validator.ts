import { z } from "zod";

// Le schéma CreateProjectSchema est utilisé pour valider les données d'entrée lors de la création d'un projet. Il utilise la bibliothèque Zod pour définir les règles de validation pour les champs "name" et "description". Le champ "name" doit être une chaîne de caractères, avec un minimum de 3 caractères et un maximum de 50 caractères. Le champ "description" est optionnel et peut contenir jusqu'à 500 caractères.

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "le nom du projet doit contenir au moins 3 caractères")
    .max(50, "le nom du projet ne peut pas dépasser 50 caractères"),

  // Le champ "description" est optionnel et peut contenir jusqu'à 500 caractères. Il est défini comme une chaîne de caractères, avec la méthode trim() pour supprimer les espaces inutiles au début et à la fin de la chaîne. La méthode max() est utilisée pour limiter la longueur de la description à 500 caractères, et un message d'erreur personnalisé est fourni si cette limite est dépassée.
  description: z
    .string()
    .trim()
    .max(500, "la description du projet ne peut pas dépasser 500 caractères")
    .optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
