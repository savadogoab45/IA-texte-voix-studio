import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth.router";
import { projectRouter } from "../project/routers/project.router";
import { documentRouter } from "../document/routers/document.router";
import { voiceRouter } from "../voice/routers/voice.router";
import { generationRouter } from "../generation/routers/generation.router";
import { dashboardRouter } from "../dashboard/routers/dashboard.router";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  project: projectRouter,
  document: documentRouter,
  voice: voiceRouter,
  generation: generationRouter,
  dashboard: dashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
