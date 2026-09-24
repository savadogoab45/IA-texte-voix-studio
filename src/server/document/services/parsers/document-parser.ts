export type SupportedDocumentFormat = "pdf" | "docx" | "txt";

export interface ParsedDocument {
    title: string;
    content: string;
    mimeType: string;
    format: SupportedDocumentFormat;
}

export interface DocumentParser {
    readonly format: SupportedDocumentFormat;
    readonly mimeTypes: readonly string[];

    parse(buffer: Buffer, filename: string): Promise<ParsedDocument>;
}
