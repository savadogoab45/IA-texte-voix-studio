import { PDFParse } from "pdf-parse";

import type { DocumentParser, ParsedDocument } from "./document-parser";

export class PdfDocumentParser implements DocumentParser {
  readonly format = "pdf" as const;

  readonly mimeTypes = ["application/pdf"] as const;

  async parse(buffer: Buffer, filename: string): Promise<ParsedDocument> {
    if (!buffer.length) {
      throw new Error("Le fichier PDF est vide.");
    }

    const parser = new PDFParse({ data: buffer });

    try {
      const result = await parser.getText();
      const content = result.text.trim();

      if (!content) {
        throw new Error(
          "Impossible d'extraire du texte depuis ce fichier PDF.",
        );
      }

      return {
        title: filename.replace(/\.[^/.]+$/, ""),
        content,
        mimeType: "application/pdf",
        format: "pdf",
      };
    } finally {
      await parser.destroy();
    }
  }
}
