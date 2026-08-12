import { generationQueue } from "../queues/generation.queue";

import {
  GENERATION_JOB_NAME,
  type GenerationJob,
} from "../jobs/generation.job";

export class GenerationQueueService {
  async dispatchGeneration(generationId: string) {
    console.log("📤 Dispatch génération :", generationId);

    const job: GenerationJob = {
      generationId,
    };

    return generationQueue.add(GENERATION_JOB_NAME, job);
  }
}
