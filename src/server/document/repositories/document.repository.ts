import { db } from "@/server/db";

export class DocumentRepository {
  // Trouver un document par son ID
  async findById(id: string) {
    return db.document.findUnique({
      where: {
        id,
      },
    });
  }

  // Trouver tous les documents d'un projet
  async findByProjectId(projectId: string) {
    return db.document.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Créer un document
  async create(
    projectId: string,
    data: {
      title: string;
      content: string;
    },
  ) {
    return db.document.create({
      data: {
        projectId,
        title: data.title,
        content: data.content,
      },
    });
  }

  // Mettre à jour un document
  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
    },
  ) {
    return db.document.update({
      where: {
        id,
      },
      data,
    });
  }

  // Trouver un document appartenant à un projet
  async findByIdAndProjectId(id: string, projectId: string) {
    return db.document.findFirst({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
  }

  // Suppression logique
  async softDelete(id: string) {
    return db.document.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // Restaurer un document
  async restore(id: string) {
    return db.document.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });
  }

  // Vérifier qu'un titre existe déjà dans un projet
  async findByProjectIdAndTitle(projectId: string, title: string) {
    return db.document.findFirst({
      where: {
        projectId,
        title,
        deletedAt: null,
      },
    });
  }

  // Vérifier les doublons lors de la mise à jour
  async findByProjectIdAndTitleExceptDocument(
    projectId: string,
    documentId: string,
    title: string,
  ) {
    return db.document.findFirst({
      where: {
        projectId,
        title,
        NOT: {
          id: documentId,
        },
        deletedAt: null,
      },
    });
  }
}
