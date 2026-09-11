import { db } from "@/server/db";

export class DocumentRepository {
  // =========================================================
  // Find by id 
  // =========================================================

  async findById(id: string) {
    return db.document.findFirst({
      where: {
        id,
        deletedAt: null,

        project: {
          deletedAt: null,
        },
      },
    });
  }

  // =========================================================
  // FIND BY ID INCLUDING DELETED
  // =========================================================

  async findByIdIncludingDeleted(id: string) {
    return db.document.findUnique({
      where: {
        id,
      },
    });
  }

  // =========================================================
  // FIND BY PROJECT
  // =========================================================

  async findByProjectId(projectId: string) {
    return db.document.findMany({
      where: {
        projectId,
        deletedAt: null,

        project: {
          deletedAt: null,
        },
      },

      orderBy: {
        createdAt: "desc",
      },
      
    });
  }

  // =========================================================
  // CREATE
  // =========================================================

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

  // =========================================================
  // UPDATE
  // =========================================================

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

  // =========================================================
  // FIND BY DOCUMENT + PROJECT
  // =========================================================

  async findByIdAndProjectId(
    id: string,
    projectId: string,
  ) {
    return db.document.findFirst({
      where: {
        id,
        projectId,
        deletedAt: null,

        project: {
          deletedAt: null,
        },
      },
    });
  }

  // =========================================================
  // FIND DELETED BY USER
  // =========================================================

  async findDeletedByUserId(userId: string) {
    return db.document.findMany({
      where: {
        deletedAt: {
          not: null,
        },

        project: {
          userId,
        },
      },

      orderBy: {
        deletedAt: "desc",
      },
    });
  }

  // =========================================================
  // SOFT DELETE
  // =========================================================

  async softDelete(id: string) {
    const deletedAt = new Date();

    return db.$transaction(async (tx) => {
      const document = await tx.document.findUnique({
        where: {
          id,
        },
      });

      if (!document) {
        throw new Error("Document introuvable.");
      }

      // Supprimer les générations encore actives
      // avec exactement le même timestamp.
      await tx.generation.updateMany({
        where: {
          documentId: id,
          deletedAt: null,
        },

        data: {
          deletedAt,
        },
      });

      // Puis supprimer le document.
      return tx.document.update({
        where: {
          id,
        },

        data: {
          deletedAt,
        },
      });
    });
  }

  // =========================================================
  // HARD DELETE
  // =========================================================

  async hardDelete(id: string) {
    return db.$transaction(async (tx) => {
      // Les générations doivent être supprimées
      // avant le document.
      await tx.generation.deleteMany({
        where: {
          documentId: id,
        },
      });

      return tx.document.delete({
        where: {
          id,
        },
      });
    });
  }

  // =========================================================
  // RESTORE
  // =========================================================

  async restore(id: string) {
    return db.$transaction(async (tx) => {
      const document = await tx.document.findUnique({
        where: {
          id,
        },
      });

      if (!document) {
        throw new Error("Document introuvable.");
      }

      if (!document.deletedAt) {
        return document;
      }

      const deletedAt = document.deletedAt;

      // Restaurer uniquement les générations
      // qui ont été supprimées avec ce document.
      await tx.generation.updateMany({
        where: {
          documentId: id,
          deletedAt,
        },

        data: {
          deletedAt: null,
        },
      });

      // Restaurer le document.
      return tx.document.update({
        where: {
          id,
        },

        data: {
          deletedAt: null,
        },
      });
    });
  }

  // =========================================================
  // CHECK DUPLICATE TITLE
  // =========================================================

  async findByProjectIdAndTitle(
    projectId: string,
    title: string,
  ) {
    return db.document.findFirst({
      where: {
        projectId,
        title,
        deletedAt: null,
      },
    });
  }

  // =========================================================
  // CHECK DUPLICATE TITLE EXCEPT CURRENT DOCUMENT
  // =========================================================

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