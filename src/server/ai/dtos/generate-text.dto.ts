import { AIProviderType } from "@prisma/client";

export interface GenerateTextDto {
  prompt: string;
}

const provider = AIProviderType.OPENAI;

console.log(provider);
