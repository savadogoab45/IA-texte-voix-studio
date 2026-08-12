import { TRPCError } from "@trpc/server";
import type { ProjectRepository } from "../repositories/project.repository";
import { ProjectMapper } from "../mappers/project.mapper";

export class RestoreProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(userId: string, projectId: string) {
    const project = await this.repository.findByIdAndUserIdIncludingDeleted(
      projectId,
      userId,
    );

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Projet introuvable.",
      });
    }
    // Vérification si le projet est déjà supprimé. Si le champ deletedAt du projet est null, cela signifie que le projet n'est pas supprimé, et une erreur TRPCError est levée avec le code "BAD_REQUEST" et un message approprié.
    if (!project.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Le projet n'est pas supprimé.",
      });
    }
    // Appel de la méthode restore du repository pour restaurer le projet supprimé. Cette méthode met à jour le champ deletedAt du projet dans la base de données pour le rendre actif à nouveau.
    const restoredProject = await this.repository.restore(projectId, userId);

    return ProjectMapper.toDto(restoredProject);
  }
}
