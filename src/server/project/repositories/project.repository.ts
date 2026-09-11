/*import { db } from "@/server/db";
import type { CreateProjectInput } from "../validators/create-project.validator";

// La classe ProjectRepository est responsable de l'accès aux données liées aux projets dans la base de données. Elle fournit des méthodes pour trouver un projet par son identifiant, vérifier l'existence d'un projet par son nom pour un utilisateur donné, et créer un nouveau projet.
export class ProjectRepository {
  // La méthode findById permet de récupérer un projet à partir de son identifiant unique. Elle prend en paramètre l'identifiant du projet et retourne le projet correspondant s'il existe, ou null sinon.
  async findById(id: string) {
    return db.project.findFirst({
      where: {
        id,
        deletedAt: null,
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
      include: {
        documents: {
          where: {
            deletedAt: null,
          },
          select: {
            _count: {
              select: {
                generations: {
                  where: {
                    deletedAt: null,
                  },
                },
              },
            },
            generations: {
              where: {
                deletedAt: null,
              },
              select: {
                duration: true,
              },
            },
          },
        },
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

  async findDeletedByUserId(userId: string) {
    return db.project.findMany({
      where: {
        userId,
        deletedAt: { not: null },
      },
      orderBy: {
        deletedAt: "desc",
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

  async hardDelete(projectId: string, userId: string) {
    return db.$transaction(async (tx) => {
      const documents = await tx.document.findMany({
        where: { projectId },
        select: { id: true },
      });

      const documentIds = documents.map((document) => document.id);

      if (documentIds.length > 0) {
        await tx.generation.deleteMany({
          where: { documentId: { in: documentIds } },
        });
        await tx.document.deleteMany({
          where: { projectId },
        });
      }

      return tx.project.delete({
        where: { id: projectId, userId },
      });
    });
  }
}
*/

import { db } from "@/server/db";
import type { CreateProjectInput } from "../validators/create-project.validator";

export class ProjectRepository {
  // =========================================================
  // FIND
  // =========================================================

  async findById(id: string) {
    return db.project.findUnique({
      where: { id },
    });
  }

  async findByUserIdAndName(userId: string, name: string) {
    return db.project.findFirst({
      where: {
        userId,
        name,
        deletedAt: null,
      },
    });
  }

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

  async findByUserId(userId: string) {
    return db.project.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        documents: {
          where: {
            deletedAt: null,
          },
          select: {
            _count: {
              select: {
                generations: {
                  where: {
                    deletedAt: null,
                  },
                },
              },
            },
            generations: {
              where: {
                deletedAt: null,
              },
              select: {
                duration: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByIdAndUserId(
    projectId: string,
    userId: string,
  ) {
    return db.project.findFirst({
      where: {
        id: projectId,
        userId,
        deletedAt: null,
      },
    });
  }

  async findByIdAndUserIdIncludingDeleted(
    projectId: string,
    userId: string,
  ) {
    return db.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });
  }

  // =========================================================
  // CREATE
  // =========================================================

  async create(
    userId: string,
    data: CreateProjectInput,
  ) {
    return db.project.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
      },
    });
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
  projectId: string,
  userId: string,
  data: {
    name?: string;
    description?: string;
  },
) {
  return db.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: data.name,
      description: data.description ?? "",
    },
  });
}

  // =========================================================
  // SOFT DELETE
  // =========================================================

  /**
   * Suppression temporaire d'un projet.
   *
   * Cascade :
   *
   * Project
   *   └── Documents
   *         └── Generations
   *
   * Le même timestamp est utilisé pour tous les éléments
   * supprimés par cette opération.
   *
   * Cela permet ensuite de restaurer uniquement les enfants
   * qui ont été supprimés avec le projet.
   */
  async softDelete(
    projectId: string,
    userId: string,
  ) {
    const deletedAt = new Date();

    return db.$transaction(async (tx) => {
      // -------------------------------------------------------
      // 1. Vérifier que le projet existe et est actif
      // -------------------------------------------------------

      const project = await tx.project.findFirst({
        where: {
          id: projectId,
          userId,
          deletedAt: null,
        },
      });

      if (!project) {
        throw new Error(
          "Projet introuvable ou déjà supprimé.",
        );
      }

      // -------------------------------------------------------
      // 2. Récupérer uniquement les documents actifs
      // -------------------------------------------------------

      const documents = await tx.document.findMany({
        where: {
          projectId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      const documentIds = documents.map(
        (document) => document.id,
      );

      // -------------------------------------------------------
      // 3. Supprimer temporairement les générations actives
      // -------------------------------------------------------

      if (documentIds.length > 0) {
        await tx.generation.updateMany({
          where: {
            documentId: {
              in: documentIds,
            },
            deletedAt: null,
          },
          data: {
            deletedAt,
          },
        });

        // -----------------------------------------------------
        // 4. Supprimer temporairement les documents actifs
        // -----------------------------------------------------

        await tx.document.updateMany({
          where: {
            id: {
              in: documentIds,
            },
            deletedAt: null,
          },
          data: {
            deletedAt,
          },
        });
      }

      // -------------------------------------------------------
      // 5. Supprimer temporairement le projet
      // -------------------------------------------------------

      return tx.project.update({
        where: {
          id: projectId,
        },
        data: {
          deletedAt,
        },
      });
    });
  }

  // =========================================================
  // RESTORE
  // =========================================================

  /**
   * Restaure un projet supprimé.
   *
   * Seuls les documents et générations ayant exactement le
   * même deletedAt que le projet sont restaurés.
   *
   * Exemple :
   *
   * Génération A supprimée individuellement
   *       ↓
   * Document supprimé
   *       ↓
   * Projet supprimé
   *
   * Lors de la restauration du projet :
   *
   * Projet       → restauré
   * Document     → restauré si supprimé avec le projet
   * Génération A → reste supprimée
   */
  async restore(
    projectId: string,
    userId: string,
  ) {
    return db.$transaction(async (tx) => {
      // -------------------------------------------------------
      // 1. Récupérer le projet supprimé
      // -------------------------------------------------------

      const project = await tx.project.findFirst({
        where: {
          id: projectId,
          userId,
          deletedAt: {
            not: null,
          },
        },
      });

      if (!project) {
        throw new Error(
          "Projet introuvable ou déjà actif.",
        );
      }

      const projectDeletedAt = project.deletedAt;

      if (!projectDeletedAt) {
        throw new Error(
          "Le projet n'est pas supprimé.",
        );
      }

      // -------------------------------------------------------
      // 2. Récupérer les documents supprimés avec le projet
      // -------------------------------------------------------

      const documents = await tx.document.findMany({
        where: {
          projectId,
          deletedAt: projectDeletedAt,
        },
        select: {
          id: true,
        },
      });

      const documentIds = documents.map(
        (document) => document.id,
      );

      // -------------------------------------------------------
      // 3. Restaurer les générations supprimées avec
      //    le projet
      // -------------------------------------------------------

      if (documentIds.length > 0) {
        await tx.generation.updateMany({
          where: {
            documentId: {
              in: documentIds,
            },
            deletedAt: projectDeletedAt,
          },
          data: {
            deletedAt: null,
          },
        });

        // -----------------------------------------------------
        // 4. Restaurer les documents
        // -----------------------------------------------------

        await tx.document.updateMany({
          where: {
            id: {
              in: documentIds,
            },
            deletedAt: projectDeletedAt,
          },
          data: {
            deletedAt: null,
          },
        });
      }

      // -------------------------------------------------------
      // 5. Restaurer le projet
      // -------------------------------------------------------

      return tx.project.update({
        where: {
          id: projectId,
        },
        data: {
          deletedAt: null,
        },
      });
    });
  }

  // =========================================================
  // TRASH
  // =========================================================

  /**
   * Récupérer les projets supprimés d'un utilisateur.
   */
  async findDeletedByUserId(userId: string) {
    return db.project.findMany({
      where: {
        userId,
        deletedAt: {
          not: null,
        },
      },
      orderBy: {
        deletedAt: "desc",
      },
    });
  }

  // =========================================================
  // HARD DELETE
  // =========================================================

  /**
   * Suppression définitive.
   *
   * Ordre :
   *
   * Generations
   *      ↓
   * Documents
   *      ↓
   * Project
   *
   * Cette méthode sera utilisée UNIQUEMENT depuis la corbeille.
   */
  async hardDelete(
    projectId: string,
    userId: string,
  ) {
    return db.$transaction(async (tx) => {
      // -------------------------------------------------------
      // 1. Vérifier que le projet appartient à l'utilisateur
      //    et qu'il est dans la corbeille
      // -------------------------------------------------------

      const project = await tx.project.findFirst({
        where: {
          id: projectId,
          userId,
          deletedAt: {
            not: null,
          },
        },
      });

      if (!project) {
        throw new Error(
          "Projet introuvable dans la corbeille.",
        );
      }

      // -------------------------------------------------------
      // 2. Récupérer les documents
      // -------------------------------------------------------

      const documents = await tx.document.findMany({
        where: {
          projectId,
        },
        select: {
          id: true,
        },
      });

      const documentIds = documents.map(
        (document) => document.id,
      );

      // -------------------------------------------------------
      // 3. Supprimer définitivement les générations
      // -------------------------------------------------------

      if (documentIds.length > 0) {
        await tx.generation.deleteMany({
          where: {
            documentId: {
              in: documentIds,
            },
          },
        });

        // -----------------------------------------------------
        // 4. Supprimer définitivement les documents
        // -----------------------------------------------------

        await tx.document.deleteMany({
          where: {
            id: {
              in: documentIds,
            },
          },
        });
      }

      // -------------------------------------------------------
      // 5. Supprimer définitivement le projet
      // -------------------------------------------------------

      return tx.project.delete({
        where: {
          id: projectId,
        },
      });
    });
  }
}
