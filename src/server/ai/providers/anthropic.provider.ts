import type { AIProvider } from "../interfaces/ai-provider.interface";
import type { GenerateTextDto } from "../dtos/generate-text.dto";

export class AnthropicProvider implements AIProvider {
  async generate(input: GenerateTextDto): Promise<string> {
    console.log(input);

    throw new Error("Anthropic provider not implemented.");
  }
}
