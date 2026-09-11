import { createAudioJobSchema } from "@/schemas/audio/create-audio-job.schema";
import { generateTextSchema } from "@/schemas/ai/generate-text.schema";
import { createTextGeneration } from "@/server/services/ai.service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const aiRouter = createTRPCRouter({
  history: protectedProcedure.query(({ ctx }) => {
    return [] as Array<{
      id: string;
      title: string;
      prompt: string;
      output?: string | null;
      type: string;
      createdAt: Date;
    }>;
  }),
  generateText: protectedProcedure.input(generateTextSchema).mutation(({ ctx, input }) => {
    return createTextGeneration(ctx.session.user.id, input);
  }),
  createAudioJob: protectedProcedure.input(createAudioJobSchema).mutation(({ ctx, input }) => {
    return {
      id: crypto.randomUUID(),
      userId: ctx.session.user.id,
      title: input.title,
      prompt: input.sourceText,
      status: "PENDING",
      type: "AUDIO",
      createdAt: new Date(),
      audioJob: {
        id: crypto.randomUUID(),
        userId: ctx.session.user.id,
        sourceText: input.sourceText,
        voice: input.voice,
        status: "PENDING",
      },
    };
  })
});
