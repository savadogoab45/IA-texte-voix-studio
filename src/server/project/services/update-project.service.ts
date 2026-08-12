import { TRPCError } from "@trpc/server";
import { ProjectMapper } from "../mappers/project.mapper";
import type { ProjectRepository } from "../repositories/project.repository";

export class UpdateProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(
    userId: string,
    projectId: string,
    data: { name?: string; description?: string },
  ) {
    const project = await this.repository.findByIdAndUserId(projectId, userId);

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Projet introuvable.",
      });
    }
    // Vérification de l'unicité du nom du projet pour l'utilisateur. Si un projet avec le même nom existe déjà pour cet utilisateur (en excluant le projet actuel), une erreur TRPCError est levée avec le code "CONFLICT" et un message approprié.
    if (data.name) {
      const existing = await this.repository.findByUserIdAndNameExceptProject(
        userId,
        projectId,
        data.name,
      );

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Un projet avec ce nom existe déjà.",
        });
      }
    }

    const updated = await this.repository.update(projectId, userId, data);

    if (!updated) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erreur lors de la mise à jour du projet.",
      });
    }

    return ProjectMapper.toDto(updated);
  }
}
