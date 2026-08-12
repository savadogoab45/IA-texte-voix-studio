import { TRPCError } from "@trpc/server";
import { ProjectMapper } from "../mappers/project.mapper";
import type { ProjectRepository } from "../repositories/project.repository";

export class DeleteProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(userId: string, projectId: string) {
    // Vérifier que le projet existe
    const project = await this.repository.findByIdAndUserId(projectId, userId);

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Projet introuvable.",
      });
    }

    // Effectuer le soft delete
    const deletedProject = await this.repository.softDelete(projectId, userId);

    // Retourner le projet supprimé
    return ProjectMapper.toDto(deletedProject);
  }
}
