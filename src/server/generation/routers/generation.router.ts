import {
    createTRPCRouter,
    protectedProcedure,
// publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

import { GenerationRepository } from "../repositories/generation.repository";
import { DocumentRepository } from "../../document/repositories/document.repository";
import { ProjectRepository } from "../../project/repositories/project.repository";
import { CreateGenerationService } from "../services/create-generation.service";
import { GetGenerationByIdService } from "../services/get-generation-by-id.service";
import { GetAllGenerationService } from "../services/get-all-generations.service";
import { UpdateGenerationService } from "../services/update-generation.service";
import { DeleteGenerationService } from "../services/delete-generation.service";
import { RestoreGenerationService } from "../services/restore-generation.service";
import { GenerationQueueService } from "@/server/queue/services/generation-queue.service";
import { RetryGenerationService } from "../services/retry-generation.service";
import { HardDeleteGenerationService } from "../services/hard-delete-generation.service";


import { RestoreGenerationSchema } from "../validators/restore-generation.validator";
import { CreateGenerationSchema } from "../validators/create-generation.validator";
import { GetGenerationSchema } from "../validators/get-generation.validator";
import { GetAllGenerationSchema } from "../validators/get-all-generation.validator";
import { UpdateGenerationSchema } from "../validators/update-generation.validator";
import { DeleteGenerationSchema } from "../validators/delete-generation.validator";
import { RetryGenerationSchema } from "../validators/retry-generation.validator";
import { RestoreProjectService } from "@/server/project/services/restore.project.service";
import { RestoreProjectSchema } from "../validators/restore-project.validator";

import { GetAllGenerationsByProjectService } from "../services/get-all-generations-by-project.service";
import { GetAllGenerationsByProjectSchema } from "../validators/get-all-generations-by-project.validator";
import { GetGenerationService } from "../services/get-generation.service";
import { GetAllUserGenerationsService } from "../services/get-all-user-generations.service";
export const generationRouter = createTRPCRouter({
  
  create: protectedProcedure
    .input(CreateGenerationSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new CreateGenerationService(
        new GenerationRepository(),
        new DocumentRepository(),
        new ProjectRepository(),
        new GenerationQueueService(),
      );

      return service.execute(ctx.session.user.id, input);
    }),

  /*create_test: publicProcedure
    .input(CreateGenerationSchema)
    .mutation(async ({ input }) => {
      const service = new CreateGenerationService(
        new GenerationRepository(),
        new DocumentRepository(),
        new ProjectRepository(),
        new GenerationQueueService(),
      );

      return service.execute("Py0QfKyt985zsrdoVb2geI5XhfpGKH2M", input);
    }),
    */

  getById: protectedProcedure
    .input(GetGenerationSchema)
    .query(async ({ ctx, input }) => {
      const service = new GetGenerationByIdService(
        new GenerationRepository(),
        new DocumentRepository(),
        new ProjectRepository(),
      );

      return service.execute(ctx.session.user.id, input.id);
    }),

  getByIdLegacy: protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const service =
      new GetGenerationService(
        new GenerationRepository(),
      );

    return service.execute(input.id);
  }),

    getAllByProject: protectedProcedure
  .input(GetAllGenerationsByProjectSchema)
  .query(async ({ ctx, input }) => {
    const service =
      new GetAllGenerationsByProjectService(
        new GenerationRepository(),
        new ProjectRepository(),
      );

    return service.execute(
      ctx.session.user.id,
      input.projectId,
    );
  }),
  
  getAll: protectedProcedure
    .input(GetAllGenerationSchema)
    .query(async ({ ctx, input }) => {
      const service = new GetAllGenerationService(
        new GenerationRepository(),
        new DocumentRepository(),
        new ProjectRepository(),
      );

      return service.execute(ctx.session.user.id, input.documentId);
    }),

    getAllMine: protectedProcedure
  .query(async ({ ctx }) => {
    const service =
      new GetAllUserGenerationsService(
        new GenerationRepository(),
      );

    return service.execute(
      ctx.session.user.id,
    );
  }),

  getDeletedMine: protectedProcedure.query(async ({ ctx }) => {
    const repository = new GenerationRepository();
    return repository.findDeletedByUser(ctx.session.user.id);
  }),


  update: protectedProcedure
    .input(UpdateGenerationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const service = new UpdateGenerationService(
        new GenerationRepository(),
        new DocumentRepository(),
        new ProjectRepository(),
      );

      return service.execute(ctx.session.user.id, id, data);
    }),

  delete: protectedProcedure
    .input(DeleteGenerationSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new DeleteGenerationService(
        new GenerationRepository(),
        new DocumentRepository(),
        new ProjectRepository(),
      );

      return service.execute(ctx.session.user.id, input.id);
    }),

  hardDelete: protectedProcedure
    .input(DeleteGenerationSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new HardDeleteGenerationService(
        new GenerationRepository(),
        new DocumentRepository(),
        new ProjectRepository(),
      );

      return service.execute(ctx.session.user.id, input.id);
    }),

    

  restore: protectedProcedure
    .input(RestoreGenerationSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new RestoreGenerationService(
        new GenerationRepository(),
        new DocumentRepository(),
        new ProjectRepository(),
      );

      return service.execute(ctx.session.user.id, input.id);
    }),


    retry: protectedProcedure
    .input(RetryGenerationSchema)
    .mutation(async ({ ctx, input }) => {
        const service = new RetryGenerationService(
            new GenerationRepository(),
            new DocumentRepository(),
            new ProjectRepository(),
            new GenerationQueueService(),
        );

        return service.execute(
            ctx.session.user.id,
            input.id,
        );
    }),

    restoreProject: protectedProcedure
      .input(RestoreProjectSchema)
      .mutation(async ({ ctx, input }) => {
        const repository = new ProjectRepository();

        const service = new RestoreProjectService(repository);

        return service.execute(
          ctx.session.user.id,
          input.projectId,
        );
      }),
});
