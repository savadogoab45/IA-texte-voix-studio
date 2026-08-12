import { Queue } from "bullmq";

import { connection } from "../connection";

import {
  type GenerationJob,
  type GenerationJobName,
} from "../jobs/generation.job";

export const generationQueue = new Queue<
  GenerationJob,
  void,
  GenerationJobName
>("generation", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: 100,
    removeOnFail: 100,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    
  },
});
