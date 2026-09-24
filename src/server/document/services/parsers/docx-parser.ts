import mammoth from "mammoth";

import type { DocumentParser, ParsedDocument } from "./document-parser";

export class DocxDocumentParser implements DocumentParser {
  readonly format = "docx" as const;

  readonly mimeTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ] as const;

  async parse(buffer: Buffer, filename: string): Promise<ParsedDocument> {
    if (!buffer.length) {
      throw new Error("Le fichier DOCX est vide.");
    }

    const result = await mammoth.extractRawText({
      buffer,
    });

    const content = result.value.trim();

    if (!content) {
      throw new Error("Impossible d'extraire du texte depuis ce fichier DOCX.");
    }

    return {
      title: filename.replace(/\.[^/.]+$/, ""),
      content,
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      format: "docx",
    };
  }
}
