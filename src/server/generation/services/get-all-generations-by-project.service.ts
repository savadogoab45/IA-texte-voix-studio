import { TRPCError } from "@trpc/server";
import type { Generation } from "@prisma/client";

import { GenerationRepository } from "../repositories/generation.repository"
import { ProjectRepository } from "../../project/repositories/project.repository";

export class GetAllGenerationsByProjectService {
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(
    userId: string,
    projectId: string,
  ): Promise<Generation[]> {
    const project =
      await this.projectRepository.findByIdAndUserId(
        projectId,
        userId,
      );

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Projet introuvable.",
      });
    }

    return this.generationRepository.findByProjectId(
      projectId,
    );
  }
}