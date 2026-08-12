import { TRPCError } from "@trpc/server";
import type { ProjectRepository } from "../repositories/project.repository";
import { ProjectMapper } from "../mappers/project.mapper";

export class GetProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(userId: string, projectId: string) {
    const project = await this.repository.findByIdAndUserId(projectId, userId);

    // Si aucun projet n'est trouvé, une erreur TRPCError avec le code "NOT_FOUND" est levée pour indiquer     que le projet est introuvable.
    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Projet introuvable.",
      });
    }
    return ProjectMapper.toDto(project);
  }
}
