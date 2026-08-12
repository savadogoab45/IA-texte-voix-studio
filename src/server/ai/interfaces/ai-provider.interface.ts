import type { GenerateTextDto } from "../dtos/generate-text.dto";

export interface AIProvider {
  generate(input: GenerateTextDto): Promise<string>;
}
