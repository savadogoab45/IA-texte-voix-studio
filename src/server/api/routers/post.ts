import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Le routeur postRouter est responsable de gérer les requêtes liées aux publications. Il utilise la bibliothèque Zod pour valider les entrées des utilisateurs et fournit des procédures publiques pour créer une nouvelle publication, récupérer la dernière publication et générer un message de salutation.
interface Post {
  id: number;
  name: string;
}
// La constante posts est un tableau qui stocke les publications créées. Chaque publication est représentée par un objet contenant un identifiant unique (id) et un nom (name). Ce tableau est utilisé pour simuler une base de données en mémoire pour les besoins de l'exemple.
const posts: Post[] = [
  {
    id: 1,
    name: "Hello World",
  },
];
// Le routeur postRouter est responsable de gérer les requêtes liées aux publications. Il utilise la bibliothèque Zod pour valider les entrées des utilisateurs et fournit des procédures publiques pour créer une nouvelle publication, récupérer la dernière publication et générer un message de salutation.
export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  // La procédure create est une mutation publique qui permet de créer une nouvelle publication. Elle prend en entrée un objet contenant le nom de la publication, valide cette entrée à l'aide de Zod, et ajoute la publication au tableau posts. Elle retourne ensuite la publication créée.
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const post: Post = {
        id: posts.length + 1,
        name: input.name,
      };
      posts.push(post);
      return post;
    }),
  // La procédure getLatest est une requête publique qui permet de récupérer la dernière publication créée. Elle retourne la dernière publication du tableau posts, ou null si aucune publication n'a été créée.
  getLatest: publicProcedure.query(() => {
    return posts.at(-1) ?? null;
  }),
});
