import type { Document } from "@prisma/client";
import type { DocumentDto } from "../dtos/document.dto";

export class DocumentMapper {
  static toDto(document: Document): DocumentDto {
    return {
      id: document.id,
      title: document.title,
      content: document.content,
      projectId: document.projectId,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
