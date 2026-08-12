// Interface CreateProjectInput définit la structure des données nécessaires pour créer un nouveau projet. Elle inclut le nom du projet (name) et une description optionnelle (description).

export interface CreateProjectInput {
  name: string;
  description?: string;
}

// Interface UpdateProjectInput définit la structure des données nécessaires pour mettre à jour un projet existant. Elle inclut l'identifiant du projet (id) et des propriétés optionnelles telles que le nom (name), la description (description) et un indicateur de favori (isFavorite).
export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
  isFavorite?: boolean;
}
