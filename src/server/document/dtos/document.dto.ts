import type { DocumentType } from "@prisma/client";

export interface DocumentDto {
  id: string;
  title: string;
  content: string | null;
  projectId: string;
  type: DocumentType;
  createdAt: Date;
  updatedAt: Date;
}
