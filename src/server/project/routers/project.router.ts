import { createTRPCRouter } from "@/server/api/trpc";
import { protectedProcedure, publicProcedure } from "@/server/api/trpc";

import { ProjectRepository } from "../repositories/project.repository";
import { CreateProjectService } from "../services/create-project.service";
import { GetProjectsService } from "../services/get-projects.service";
import { GetProjectService } from "../services/get-project.service";
import { UpdateProjectService } from "../services/update-project.service";
import { DeleteProjectService } from "../services/delete-project.service";
import { CreateProjectSchema } from "../validators/create-project.validator";
import { UpdateProjectSchema } from "../validators/update-project.validator";
import { DeleteProjectSchema } from "../validators/delete-project.validator";
import { GetProjectSchema } from "../validators/get-project.validator";
import { RestoreProjectSchema } from "@/server/generation/validators/restore-project.validator";
import { RestoreProjectService } from "../services/restore.project.service";

// Le routeur projectRouter est responsable de gérer les requêtes liées aux projets. Il utilise le schéma de validation CreateProjectSchema pour valider les entrées des utilisateurs et appelle le service CreateProjectService pour créer un nouveau projet.

export const projectRouter = createTRPCRouter({
  // La procédure create est une mutation protégée qui permet à un utilisateur authentifié de créer un nouveau projet. Elle prend en entrée les données du projet, valide ces données à l'aide de CreateProjectSchema, et utilise le service CreateProjectService pour créer le projet dans la base de données.

  create: protectedProcedure
    .input(CreateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      // Crée une instance du repository pour accéder aux données des projets

      const repository = new ProjectRepository();

      // Crée une instance du service pour gérer la logique de création de projet

      const service = new CreateProjectService(repository);
      // Appelle le service pour créer un nouveau projet avec les données fournies par l'utilisateur authentifié et retourne le résultat.
      return service.execute(ctx.session.user.id, input);
    }),

  /*createTest: publicProcedure
    .input(CreateProjectSchema)
    .mutation(async ({ input }) => {
      const repository = new ProjectRepository();
      const service = new CreateProjectService(repository);

      return service.execute(
        "Py0QfKyt985zsrdoVb2geI5XhfpGKH2M", // Utilisateur de test
        input,
      );
    }),
  */

  // La procédure getAll est une requête protégée qui permet à un utilisateur authentifié de récupérer la liste complète de ses projets. Elle utilise le service GetProjectsService pour obtenir tous les projets associés à l'utilisateur.
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const repository = new ProjectRepository();
    const service = new GetProjectsService(repository);

    // Appelle le service pour récupérer la liste complète des projets de l'utilisateur authentifié et retourne les résultats.
    return service.execute(ctx.session.user.id);
  }),
  // La procédure get est une requête protégée qui permet à un utilisateur authentifié de récupérer les informations d'un projet spécifique en fonction de son nom. Elle prend en entrée le nom du projet, valide cette entrée à l'aide de CreateProjectSchema, et utilise le service GetProjectService pour obtenir les détails du projet depuis la base de données.

  get: protectedProcedure
    .input(GetProjectSchema)
    .query(async ({ ctx, input }) => {
      const repository = new ProjectRepository();
      const service = new GetProjectService(repository);
      return service.execute(ctx.session.user.id, input.projectId);
    }),
    
  // La procédure update est une mutation protégée qui permet à un utilisateur authentifié de mettre à jour les informations d'un projet spécifique. Elle prend en entrée les données du projet à mettre à jour, valide ces données à l'aide de CreateProjectSchema, et utilise le service UpdateProjectService pour effectuer la mise à jour dans la base de données.
  update: protectedProcedure
    .input(UpdateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const repository = new ProjectRepository();
      const service = new UpdateProjectService(repository);

      return service.execute(ctx.session.user.id, input.projectId, input);
    }),

  // La procédure delete est une mutation protégée qui permet à un utilisateur authentifié de supprimer un projet spécifique. Elle prend en entrée l'identifiant du projet à supprimer, valide cette entrée à l'aide de DeleteProjectSchema, et utilise le service DeleteProjectService pour effectuer la suppression dans la base de données.

  delete: protectedProcedure
    .input(DeleteProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const repository = new ProjectRepository();
      const service = new DeleteProjectService(repository);
      return service.execute(ctx.session.user.id, input.projectId);
    }),

    restore: protectedProcedure
  .input(RestoreProjectSchema)
  .mutation(async ({ ctx, input }) => {
    const repository = new ProjectRepository();

    const service = new RestoreProjectService(repository);

    return service.execute(
      ctx.session.user.id,
      input.projectId,
    );
  }),
});
