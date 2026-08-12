// Interface ProjectDto définit la structure des données d'un projet qui sera transférée entre le serveur et le client. Elle inclut l'identifiant du projet (id), le nom (name), la description (description), un indicateur de favori (isFavorite), un indicateur d'archivage (isArchived) et la date de création (createdAt).
export interface ProjectDto {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: Date;
}
