import type { Worker } from "bullmq";

export function registerGenerationEvents(worker: Worker) {
  worker.on("completed", (job) => {
    console.log(`✅ ${job.name} terminé`);
  });

  worker.on("failed", (job, error) => {
    console.error(`❌ ${job?.name} échoué`, error);
  });

  worker.on("progress", (job, progress) => {
    if (typeof progress === "number") {
      console.log(`📈 ${job.id}: ${progress}%`);
    } else {
      console.log("📈", job.id, progress);
    }
  });
}
