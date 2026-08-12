/**
* VOUS N'AVEZ PROBABLEMENT PAS BESOIN DE MODIFIER CE FICHIER, SAUF SI :
* 1. Vous souhaitez modifier le contexte de la requête (voir la partie 1).
* 2. Vous souhaitez créer un nouveau middleware ou un nouveau type de procédure (voir la partie 3).
*
* En résumé : c'est ici que tous les éléments du serveur tRPC sont créés et intégrés. Les composants dont vous aurez
* besoin sont documentés en conséquence vers la fin.

*/
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";

/**
* 1. CONTEXTE
*
* Cette section définit les « contextes » disponibles dans l'API backend.
*
* Ces contextes permettent d'accéder à des éléments lors du traitement d'une requête, tels que la base de données, la session, etc.
*
* Cette fonction génère les « éléments internes » d'un contexte tRPC. Le gestionnaire d'API et les clients RSC
* encapsulent chacun ce contexte et fournissent le contexte requis.
*
* @see https://trpc.io/docs/server/context

*/
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    ...opts,
    session,
  };
};

/**

* 2. INITIALISATION
*
* C'est ici que l'API tRPC est initialisée, en connectant le contexte et le transformateur. Nous    analysons également
* les erreurs ZodError afin de garantir la sécurité des types côté client si votre procédure échoue en raison d'erreurs de validation
* côté serveur.
*/
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**

* 3. ROUTEUR ET PROCÉDURE (LA PARTIE ESSENTIELLE)
*
* Ce sont les éléments nécessaires à la construction de votre API tRPC. Vous devez les importer fréquemment dans le répertoire
* "/src/server/api/routers".
*/

/**

* Voici comment créer de nouveaux routeurs et sous-routeurs dans votre API tRPC.
*
* @see https://trpc.io/docs/router
*/
export const createTRPCRouter = t.router;

/**
 * Intergiciel permettant de chronométrer l'exécution des procédures et d'ajouter un délai artificiel en développement.
 *
 * Vous pouvez le supprimer si vous le souhaitez, mais il peut aider à détecter les effets de cascade indésirables en simulant
 * la latence réseau qui se produirait en production mais pas en développement local.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // Ajoute un délai artificiel aléatoire entre 100 et 500 ms pour simuler la latence réseau en développement.
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});
/**

* 4. PROCÉDURE (LA PARTIE IMPORTANTE)
*
* Voici les éléments nécessaires à la construction de votre API tRPC. Vous devriez les importer fréquemment dans le répertoire
* "/src/server/api/routers".
*/
export const publicProcedure = t.procedure.use(timingMiddleware);

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
