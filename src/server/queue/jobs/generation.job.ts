export const GENERATION_JOB_NAME = "generate";

export interface GenerationJob {
  generationId: string;
}

export type GenerationJobName = typeof GENERATION_JOB_NAME;
