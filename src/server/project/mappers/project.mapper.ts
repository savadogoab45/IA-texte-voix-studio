import type { Project } from "@prisma/client";
import type { ProjectDto } from "../dtos/project.dto";
import type { CreateProjectInput } from "../types/project.types";

// La classe ProjectMapper est responsable de la transformation des entités de projet en objets de transfert de données (DTOs) et vice versa. Elle fournit des méthodes pour convertir un projet en DTO, convertir une liste de projets en liste de DTOs, et créer une entité de projet à partir des données d'entrée fournies par l'utilisateur.
export class ProjectMapper {
  // La méthode toDto prend un projet en entrée et retourne un objet ProjectDto correspondant. Elle mappe les propriétés du projet vers les propriétés du DTO, en s'assurant que les valeurs sont correctement formatées.
  static toDto(project: Project): ProjectDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      isFavorite: project.isFavorite,
      isArchived: project.isArchived,
      createdAt: project.createdAt,
    };
  }
  // La méthode toDtoList prend une liste de projets en entrée et retourne une liste d'objets ProjectDto correspondants. Elle utilise la méthode toDto pour convertir chaque projet individuel en DTO.
  static toDtoList(projects: Project[]): ProjectDto[] {
    return projects.map((project) => this.toDto(project));
  }
  // La méthode toCreateEntity prend les données d'entrée fournies par l'utilisateur pour créer un projet et retourne un objet représentant l'entité de projet à créer. Elle s'assure que les valeurs sont correctement formatées, en supprimant les espaces inutiles et en gérant les valeurs nulles.
  static toCreateEntity(input: CreateProjectInput) {
    return {
      name: input.name.trim(),
      description: input.description?.trim() ?? null,
    };
  }
}
