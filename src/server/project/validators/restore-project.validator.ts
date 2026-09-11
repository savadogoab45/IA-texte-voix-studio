import { z } from "zod";

// Le schéma RestoreProjectSchema est utilisé pour valider les données d'entrée lors de la restauration d'un projet. Il utilise la bibliothèque Zod pour définir les règles de validation pour le champ "id". Le champ "id" doit être une chaîne de caractères, avec un minimum de 1 caractère et un maximum de 50 caractères. Un message d'erreur personnalisé est fourni si ces conditions ne sont pas respectées.
export const RestoreProjectSchema = z.object({
  id: z.string().min(1).max(50)
  
});