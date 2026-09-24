import type { DocumentParser, ParsedDocument } from "./document-parser";

export class TxtDocumentParser implements DocumentParser {
  readonly format = "txt" as const;

  readonly mimeTypes = ["text/plain"] as const;

  async parse(buffer: Buffer, filename: string): Promise<ParsedDocument> {
    const content = buffer.toString("utf-8").trim();

    if (!content) {
      throw new Error("Le fichier TXT est vide.");
    }

    return {
      title: filename.replace(/\.[^/.]+$/, ""),
      content,
      mimeType: "text/plain",
      format: "txt",
    };
  }
}
