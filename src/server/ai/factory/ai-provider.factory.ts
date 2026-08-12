import { AIProviderType } from "@prisma/client";

import type { AIProvider } from "../interfaces/ai-provider.interface";

import { AnthropicProvider } from "../providers/anthropic.provider";
import { GeminiProvider } from "../providers/gemini.provider";
import { OpenAIProvider } from "../providers/openai.provider";

export class AIProviderFactory {
  static create(provider: AIProviderType): AIProvider {
    switch (provider) {
      case AIProviderType.OPENAI:
        return new OpenAIProvider();

      case AIProviderType.GEMINI:
        return new GeminiProvider();

      case AIProviderType.ANTHROPIC:
        return new AnthropicProvider();

      default:
        throw new Error(`Provider IA non supporté `);
    }
  }
}
