import { UnrecoverableError, Worker } from "bullmq";

import { ProcessGenerationService } from "../../generation/services/process-generation.service";
import { GenerationRepository } from "../../generation/repositories/generation.repository";
import { VoiceRepository } from "../../voice/repositories/voice.repository";

import type { GenerationJob } from "../jobs/generation.job";
import { connection } from "../connection";

const processGenerationService = new ProcessGenerationService(
  new GenerationRepository(),
  new VoiceRepository(),
);

export const generationWorker = new Worker<GenerationJob>(
  "generation",
  async (job) => {
    console.log("📥 Job reçu :", job.data);
    try {
                await processGenerationService.execute(
                    job.data.generationId,
                );
            } catch (error) {
                if (
                    error instanceof Error &&
                    (
                        error.message.includes("Quota OpenAI") ||
                        error.message.includes("Clé API") ||
                        error.message.includes("Unsupported parameter")
                    )
                ) {
                    throw new UnrecoverableError(error.message);
                }

                throw error;
            }
  },
  {
    connection,
    concurrency: 2,
  },
);

generationWorker.on("completed", (job) => {
  console.log(`✅ Generation ${job.id} completed.`);
});

generationWorker.on("failed", (job, error) => {
  console.error(
        `❌ Generation ${job?.id} failed.`,
        error.message,
    );
});
