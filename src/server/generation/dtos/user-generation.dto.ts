import type { GenerationDto } from "./generation.dto";

export interface UserGenerationDto
  extends GenerationDto {
  document: {
    id: string;
    title: string;

    project: {
      id: string;
      name: string;
    };
  };
}