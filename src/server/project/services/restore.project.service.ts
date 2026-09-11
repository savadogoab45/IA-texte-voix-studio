import { TRPCError } from "@trpc/server";

import type { ProjectRepository } from "../repositories/project.repository";
import { ProjectMapper } from "../mappers/project.mapper";

export class RestoreProjectService {
  constructor(
    private readonly repository: ProjectRepository,
  ) {}

  async execute(
    userId: string,
    projectId: string,
  ) {
    // Vérifier que le projet existe
    // et appartient à l'utilisateur.
    const project =
      await this.repository.findByIdAndUserIdIncludingDeleted(
        projectId,
        userId,
      );

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Projet introuvable.",
      });
    }

    // Le projet doit être dans la corbeille.
    if (!project.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Le projet n'est pas supprimé.",
      });
    }

    // Restaurer le projet et les éléments qui ont
    // été supprimés avec lui.
    const restoredProject =
      await this.repository.restore(
        projectId,
        userId,
      );

    return ProjectMapper.toDto(restoredProject);
  }
}