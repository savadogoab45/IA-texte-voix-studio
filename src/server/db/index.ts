import { PrismaClient } from "@prisma/client";

// La constante globalForPrisma est utilisée pour stocker une instance unique de PrismaClient dans l'objet globalThis. Cela permet de réutiliser la même instance de PrismaClient dans toute l'application, évitant ainsi la création de multiples instances qui pourraient entraîner des problèmes de performance et de gestion des connexions à la base de données.
const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};
// La constante db est une instance unique de PrismaClient qui est utilisée pour interagir avec la base de données. Elle est initialisée une seule fois et réutilisée dans toute l'application pour éviter la création de multiples instances de PrismaClient, ce qui pourrait entraîner des problèmes de performance et de gestion des connexions à la base de données.
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
