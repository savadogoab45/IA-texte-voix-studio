import type { GenerateTextInput } from "@/schemas/ai/generate-text.schema";

export async function createTextGeneration(userId: string, input: GenerateTextInput) {
  const output = `Brouillon genere pour: ${input.prompt.slice(0, 180)}`;

  return {
    id: crypto.randomUUID(),
    userId,
    title: input.title,
    prompt: input.prompt,
    output,
    status: "COMPLETED",
    type: "TEXT",
    model: input.model,
    createdAt: new Date(),
  };
}
