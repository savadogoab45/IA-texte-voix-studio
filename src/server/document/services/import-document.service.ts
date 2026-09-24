import { TRPCError } from "@trpc/server";

import type { ProjectRepository } from "@/server/project/repositories/project.repository";

import { DocumentMapper } from "../mappers/document.mapper";
import type { DocumentRepository } from "../repositories/document.repository";
import { DocxDocumentParser } from "./parsers/docx-parser";
import { PdfDocumentParser } from "./parsers/pdf-parser";
import { TxtDocumentParser } from "./parsers/txt-parser";
import type {
  DocumentParser,
  ParsedDocument,
} from "./parsers/document-parser";

export type ImportDocumentInput = {
  projectId: string;
  filename: string;
  mimeType: string;
  buffer: Buffer;
};

export class ImportDocumentService {
  private readonly parsers: DocumentParser[] = [
    new PdfDocumentParser(),
    new DocxDocumentParser(),
    new TxtDocumentParser(),
  ];

  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, data: ImportDocumentInput) {
    // =========================================================
    // 1. Vérifier que le projet existe et appartient à l'utilisateur
    // =========================================================

    const project = await this.projectRepository.findByIdAndUserId(
      data.projectId,
      userId,
    );

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Le projet n'existe pas ou ne vous appartient pas.",
      });
    }

    // =========================================================
    // 2. Vérifier le fichier
    // =========================================================

    if (!data.buffer.length) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Le fichier est vide.",
      });
    }

    // =========================================================
    // 3. Trouver le parser correspondant
    // =========================================================

    const parser = this.parsers.find((item) =>
      item.mimeTypes.some((mimeType) => mimeType === data.mimeType),
    );

    if (!parser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Format de fichier non pris en charge. Formats acceptés : PDF, DOCX et TXT.",
      });
    }

    // =========================================================
    // 4. Extraire le contenu
    // =========================================================

    let parsedDocument: ParsedDocument;

    try {
      parsedDocument = await parser.parse(data.buffer, data.filename);
    } catch (error) {
      console.error("Erreur lors de l'import du document :", error);

      const message =
        error instanceof Error ? error.message : "Erreur inconnue du parseur PDF.";

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: message.includes("extrait")
          ? "Ce PDF est valide, mais aucun texte n'a pu être extrait. Les PDF scannés nécessitent une OCR."
          : "Impossible de lire ce PDF. Vérifiez qu'il n'est pas corrompu ou protégé par un mot de passe.",
      });
    }

    // =========================================================
    // 5. Vérifier le titre
    // =========================================================

    const existingDocument =
      await this.documentRepository.findByProjectIdAndTitle(
        data.projectId,
        parsedDocument.title,
      );

    if (existingDocument) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Un document portant ce titre existe déjà dans ce projet.",
      });
    }

    // =========================================================
    // 6. Créer le document
    // =========================================================

    const newDocument = await this.documentRepository.createImported(
      data.projectId,
      {
        title: parsedDocument.title,
        content: parsedDocument.content,
        mimeType: parsedDocument.mimeType,
      },
    );

    // =========================================================
    // 7. Retourner le DTO
    // =========================================================

    return DocumentMapper.toDto(newDocument);
  }
}
