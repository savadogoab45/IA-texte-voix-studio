import OpenAI from "openai";

import type { AIProvider } from "../interfaces/ai-provider.interface";
import type { GenerateTextDto } from "../dtos/generate-text.dto";

import { openai } from "@/lib/openai";

export class OpenAIProvider implements AIProvider {
  async generate(input: GenerateTextDto): Promise<string> {
    try {
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL ?? "gpt-5.5",

        max_output_tokens: 300000,
        input: [
          {
            role: "system",
            content:
              "You are an expert at preparing text for high-quality text-to-speech synthesis. Improve punctuation, readability, and sentence flow without changing the meaning.",
          },
          {
            role: "user",
            content: input.prompt,
          },
        ],
      });

      return response.output_text;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        switch (error.status) {
          case 401:
            throw new Error("Clé API OpenAI invalide.");

          case 429:
            throw new Error(
              "Quota OpenAI dépassé ou facturation inactive."
            );

          case 500:
            throw new Error(
              "Erreur temporaire des serveurs OpenAI."
            );

          default:
            throw new Error(
              `OpenAI (${error.status}) : ${error.message}`
            );
        }
      }

      throw error;
    }
  }
}
