import { createTRPCRouter, protectedProcedure } from "../trpc";

// Le routeur authRouter est responsable de gérer les requêtes liées à l'authentification. Il utilise la procédure protégée protectedProcedure pour s'assurer que seules les requêtes authentifiées peuvent accéder aux informations de l'utilisateur.
export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.session.user.id,
      name: ctx.session.user.name,
      email: ctx.session.user.email,
    };
  }),
});
