import {
  UnrecoverableError,
  Worker,
} from "bullmq";

import {
  ProcessGenerationService,
} from "../../generation/services/process-generation.service";

import {
  GenerationRepository,
} from "../../generation/repositories/generation.repository";

import {
  VoiceRepository,
} from "../../voice/repositories/voice.repository";

import type {
  GenerationJob,
} from "../jobs/generation.job";

import {
  connection,
} from "../connection";

// ===========================================================
// SERVICE
// ===========================================================

const processGenerationService =
  new ProcessGenerationService(
    new GenerationRepository(),
    new VoiceRepository(),
  );

// ===========================================================
// WORKER
// ===========================================================

export const generationWorker =
  new Worker<GenerationJob>(
    "generation",

    async (job) => {
      console.log(
        "📥 Job reçu :",
        job.data,
      );

      try {
        await processGenerationService.execute(
          job.data.generationId,
        );

        console.log(
          "✅ Traitement du job terminé :",
          job.data.generationId,
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Erreur inconnue.";

        console.error(
          "❌ Erreur worker :",
          message,
        );

        /**
         * Ces erreurs ne doivent pas être
         * retentées automatiquement.
         */
        if (
          message.includes(
            "Quota OpenAI",
          ) ||
          message.includes(
            "Clé API",
          ) ||
          message.includes(
            "Unsupported parameter",
          ) ||
          message.includes(
            "Provider IA",
          ) ||
          message.includes(
            "fournisseur vocal",
          ) ||
          message.includes(
            "Voix introuvable",
          ) ||
          message.includes(
            "Voix est requise",
          )
        ) {
          throw new UnrecoverableError(
            message,
          );
        }

        /**
         * Les autres erreurs restent
         * retryables par BullMQ.
         */
        throw error;
      }
    },

    {
      connection,

      concurrency: 1,
      // Le timeout Edge TTS peut durer jusqu'à 10 minutes.
      // Le verrou doit rester valide pendant toute cette durée.
      lockDuration: 15 * 60 * 1000,
      lockRenewTime: 60 * 1000,
      stalledInterval: 60 * 1000,
    },
  );

// ===========================================================
// COMPLETED
// ===========================================================

generationWorker.on(
  "completed",
  (job) => {
    console.log(
      `✅ Generation ${job.id} completed.`,
    );
  },
);

// ===========================================================
// FAILED
// ===========================================================

generationWorker.on(
  "failed",
  (job, error) => {
    console.error(
      `❌ Generation ${job?.id} failed.`,
      error.message,
    );
  },
);