export interface DocumentDto {
  id: string;
  title: string;
  content: string | null;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}
