import { generationQueue } from "../queues/generation.queue";

export class GenerationProducer {
  static async dispatch(generationId: string) {
    return generationQueue.add("generate", {
      generationId,
    });
  }
}
