import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { ProjectRepository } from "@/server/project/repositories/project.repository";
import { DocumentRepository } from "../repositories/document.repository";
import { CreateDocumentService } from "../services/create-document.service";
import { GetAllDocumentsService } from "../services/get-all-documents.service";
import { GetDocumentByIdService } from "../services/get-document-by-id.service";
import { UpdateDocumentService } from "../services/update-document.service";
import { DeleteDocumentService } from "../services/delete-document.service";
import { RestoreDocumentService } from "../services/restore-document.service";

import { CreateDocumentSchema } from "../validators/create-document.validator";
import { GetAllDocumentsSchema } from "../validators/get-all-document.validator";
import { GetDocumentSchema } from "../validators/get-document.validator";
import { UpdateDocumentSchema } from "../validators/update-document.validator";
import { DeleteDocumentSchema } from "../validators/delete-document.validator";
import { RestoreDocumentSchema } from "../validators/restore-document.validator";

export const documentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      const documentRepository = new DocumentRepository();
      const projectRepository = new ProjectRepository();

      const service = new CreateDocumentService(
        documentRepository,
        projectRepository,
      );

      return service.execute(ctx.session.user.id, input);
    }),

  createTest: publicProcedure
    .input(CreateDocumentSchema)
    .mutation(async ({ input }) => {
      const documentRepository = new DocumentRepository();
      const projectRepository = new ProjectRepository();

      const service = new CreateDocumentService(
        documentRepository,
        projectRepository,
      );

      return service.execute(
        "Py0QfKyt985zsrdoVb2geI5XhfpGKH2M", // Utilisateur de test
        input,
      );
    }),

  getAll: protectedProcedure
    .input(GetAllDocumentsSchema)
    .query(async ({ ctx, input }) => {
      const documentRepository = new DocumentRepository();
      const projectRepository = new ProjectRepository();

      const service = new GetAllDocumentsService(
        documentRepository,
        projectRepository,
      );

      return service.execute(ctx.session.user.id, input.projectId);
    }),

  getAllTest: publicProcedure
    .input(GetAllDocumentsSchema)
    .query(async ({ input }) => {
      const documentRepository = new DocumentRepository();
      const projectRepository = new ProjectRepository();

      const service = new GetAllDocumentsService(
        documentRepository,
        projectRepository,
      );

      return service.execute(
        "Py0QfKyt985zsrdoVb2geI5XhfpGKH2M", // Utilisateur de test
        input.projectId,
      );
    }),

  getById: protectedProcedure
    .input(GetDocumentSchema)
    .query(async ({ ctx, input }) => {
      const documentRepository = new DocumentRepository();
      const projectRepository = new ProjectRepository();

      const service = new GetDocumentByIdService(
        documentRepository,
        projectRepository,
      );

      return service.execute(ctx.session.user.id, input.documentId);
    }),

  update: protectedProcedure
    .input(UpdateDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      const documentRepository = new DocumentRepository();
      const projectRepository = new ProjectRepository();

      const service = new UpdateDocumentService(
        documentRepository,
        projectRepository,
      );

      const { id, ...data } = input;

      return service.execute(ctx.session.user.id, id, data);
    }),

  delete: protectedProcedure
    .input(DeleteDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      const documentRepository = new DocumentRepository();
      const projectRepository = new ProjectRepository();

      const service = new DeleteDocumentService(
        documentRepository,
        projectRepository,
      );

      return service.execute(ctx.session.user.id, input.documentId);
    }),

  restore: protectedProcedure
    .input(RestoreDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      const documentRepository = new DocumentRepository();
      const projectRepository = new ProjectRepository();

      const service = new RestoreDocumentService(
        documentRepository,
        projectRepository,
      );

      return service.execute(ctx.session.user.id, input.documentId);
    }),
});
