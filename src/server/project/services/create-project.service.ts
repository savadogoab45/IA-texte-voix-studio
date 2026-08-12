import { TRPCError } from "@trpc/server";
import type { ProjectRepository } from "../repositories/project.repository";
import type { CreateProjectInput } from "../validators/create-project.validator";
import { ProjectMapper } from "../mappers/project.mapper";

export class CreateProjectService {
  constructor(private readonly repository: ProjectRepository) {}
  // La méthode execute est responsable de la logique de création d'un projet. Elle prend en paramètres l'identifiant de l'utilisateur et les données du projet, vérifie si un projet avec le même nom existe déjà pour cet utilisateur, et crée le projet si aucune duplication n'est trouvée. Si un projet avec le même nom existe déjà, elle lance une erreur TRPCError avec le code "CONFLICT".
  async execute(userId: string, data: CreateProjectInput) {
    // Vérifier si un projet existe déjà
    const project = await this.repository.findByUserIdAndName(
      userId,
      data.name,
    );

    if (project) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Un projet portant ce nom existe déjà.",
      });
    }

    // Créer le projet
    const projectcreated = await this.repository.create(userId, data);
    return ProjectMapper.toDto(projectcreated);
  }
}
