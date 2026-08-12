import { createAuthClient } from "better-auth/react";
/**
 * 1. CONTEXTE DE LA REQUÊTE
 * Cette section définit les « contextes » disponibles dans l'API backend.
 * Ces contextes permettent d'accéder à des éléments lors du traitement d'une requête, tels que la base de données, la session, etc.
 * Cette fonction génère les « éléments internes » d'un contexte tRPC. Le gestionnaire d'API et les clients RSC
 * encapsulent chacun ce contexte et fournissent le contexte requis.
 * @see https://trpc.io/docs/server/context
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
