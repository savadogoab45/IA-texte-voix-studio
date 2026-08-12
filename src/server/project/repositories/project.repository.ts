import { db } from "@/server/db";
import type { CreateProjectInput } from "../validators/create-project.validator";

// La classe ProjectRepository est responsable de l'accès aux données liées aux projets dans la base de données. Elle fournit des méthodes pour trouver un projet par son identifiant, vérifier l'existence d'un projet par son nom pour un utilisateur donné, et créer un nouveau projet.
export class ProjectRepository {
  // La méthode findById permet de récupérer un projet à partir de son identifiant unique. Elle prend en paramètre l'identifiant du projet et retourne le projet correspondant s'il existe, ou null sinon.
  async findById(id: string) {
    return db.project.findUnique({
      where: {
        id,
      },
    });
  }

  // La méthode findByUserIdAndName vérifie si un projet avec un nom donné existe pour un utilisateur spécifique. Elle prend en paramètres l'identifiant de l'utilisateur et le nom du projet, et retourne le projet s'il existe, ou null sinon.
  async findByUserIdAndName(userId: string, name: string) {
    return db.project.findFirst({
      where: {
        userId,
        name,
        deletedAt: null,
      },
    });
  }

  // La méthode create permet de créer un nouveau projet pour un utilisateur donné. Elle prend en paramètres l'identifiant de l'utilisateur et les données du projet (nom et description), et retourne le projet créé.
  async create(userId: string, data: CreateProjectInput) {
    return db.project.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
      },
    });
  }
  // La méthode findByUserId permet de récupérer tous les projets associés à un utilisateur spécifique. Elle prend en paramètre l'identifiant de l'utilisateur et retourne une liste de projets triés par date de création décroissante.
  async findByUserId(userId: string) {
    return db.project.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  // La méthode findByIdAndUserId permet de récupérer un projet spécifique en fonction de son identifiant et de l'identifiant de l'utilisateur. Elle prend en paramètres l'identifiant du projet et l'identifiant de l'utilisateur, et retourne le projet correspondant s'il existe, ou null sinon.
  async findByIdAndUserId(projectId: string, userId: string) {
    return db.project.findFirst({
      where: {
        id: projectId,
        userId,
        deletedAt: null,
      },
    });
  }

  // La méthode findByUserIdAndNameExceptProject vérifie si un projet avec un nom donné existe pour un utilisateur spécifique, en excluant un projet particulier. Elle prend en paramètres l'identifiant de l'utilisateur, l'identifiant du projet à exclure et le nom du projet, et retourne le projet s'il existe, ou null sinon.
  async findByUserIdAndNameExceptProject(
    userId: string,
    projectId: string,
    name: string,
  ) {
    return db.project.findFirst({
      where: {
        userId,
        name,
        NOT: {
          id: projectId,
        },
        deletedAt: null,
      },
    });
  }

  async update(
    projectId: string,
    userId: string,
    data: { name?: string; description?: string },
  ) {
    return db.project.update({
      where: {
        id: projectId,
        userId,
        deletedAt: null,
      },
      data: {
        name: data.name,
        description: data.description ?? "",
      },
    });
  }

  async softDelete(projectId: string, userId: string) {
    return db.project.update({
      where: {
        id: projectId,
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findByIdAndUserIdIncludingDeleted(projectId: string, userId: string) {
    return db.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });
  }

  async restore(projectId: string, userId: string) {
    return db.project.update({
      where: {
        id: projectId,
        userId,
      },
      data: {
        deletedAt: null,
      },
    });
  }
}
