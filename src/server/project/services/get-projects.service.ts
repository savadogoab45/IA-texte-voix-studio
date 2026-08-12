import { ProjectMapper } from "../mappers/project.mapper";
import type { ProjectRepository } from "../repositories/project.repository";

// La classe GetProjectsService est responsable de la logique métier pour récupérer la liste des projets associés à un utilisateur spécifique. Elle utilise le ProjectRepository pour accéder aux données des projets dans la base de données et le ProjectMapper pour transformer les entités de projet en objets de transfert de données (DTOs) avant de les retourner.

export class GetProjectsService {
  // Le constructeur de la classe GetProjectsService prend en paramètre une instance de ProjectRepository, qui est utilisée pour interagir avec la base de données et récupérer les projets associés à un utilisateur.
  constructor(private readonly repository: ProjectRepository) {}

  //  La méthode execute récupère la liste des projets associés à un utilisateur spécifique. Elle prend en paramètre l'identifiant de l'utilisateur et utilise le repository pour obtenir les projets depuis la base de données. Ensuite, elle mappe les projets récupérés en DTOs (Data Transfer Objects) à l'aide du ProjectMapper et retourne la liste des DTOs.

  async execute(userId: string) {
    const projects = await this.repository.findByUserId(userId);

    return ProjectMapper.toDtoList(projects);
  }
}
