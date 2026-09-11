import { TRPCError } from "@trpc/server";

import type { ProjectRepository } from "../repositories/project.repository";

export class HardDeleteProjectService {
  constructor(
    private readonly repository: ProjectRepository,
  ) {}

  async execute(
    userId: string,
    projectId: string,
  ) {
    // Vérifier que le projet existe
    // et appartient bien à l'utilisateur.
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

    // La suppression définitive ne doit être possible
    // que depuis la corbeille.
    if (!project.deletedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Le projet doit être supprimé avant de pouvoir être supprimé définitivement.",
      });
    }

    return this.repository.hardDelete(
      projectId,
      userId,
    );
  }
}