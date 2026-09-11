import {
  GenerationStatus,
} from "@prisma/client";

import { TRPCError } from "@trpc/server";

import type { VoiceRepository } from "@/server/voice/repositories/voice.repository";

import type { GenerationRepository } from "../repositories/generation.repository";

import { GenerationPipeline } from "../pipeline/generation.pipeline";

export class ProcessGenerationService {
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly voiceRepository: VoiceRepository,
  ) {}

  async execute(
    generationId: string,
  ): Promise<void> {
    console.log(
      "⚙️ Début du traitement :",
      generationId,
    );

    // =========================================================
    // LOAD GENERATION
    // =========================================================

    const generation =
      await this.generationRepository.findById(
        generationId,
      );

    if (!generation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Génération introuvable.",
      });
    }

    console.log(
      "✅ Génération chargée",
    );

    try {
      // =======================================================
      // RUNNING
      // =======================================================

      await this.generationRepository.update(
        generation.id,
        {
          status:
            GenerationStatus.RUNNING,

          progress: 5,

          currentStep:
            "Initialisation",

          error: null,
        },
      );

      console.log(
        "🟡 Statut RUNNING",
      );

      // =======================================================
      // VALIDATION DU PROMPT
      // =======================================================

      if (!generation.prompt?.trim()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Le texte de génération est vide.",
        });
      }

      // =======================================================
      // PROVIDERS
      // =======================================================

      console.log(
        "🤖 Provider IA :",
        generation.providerAi ??
          "AUCUN",
      );

      console.log(
        "🎙️ Provider vocal :",
        generation.providerVoice ??
          "AUCUN",
      );

      // =======================================================
      // VOICE
      // =======================================================

      let voice = null;

      if (generation.voiceId) {
        voice =
          await this.voiceRepository.findById(
            generation.voiceId,
          );

        if (!voice) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Voix introuvable.",
          });
        }

        if (
          !voice.isActive ||
          voice.deletedAt
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Cette voix n'est plus disponible.",
          });
        }

        // =====================================================
        // VERIFICATION PROVIDER
        // =====================================================

        if (
          generation.providerVoice &&
          voice.provider !==
            generation.providerVoice
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "La voix sélectionnée ne correspond pas au fournisseur vocal.",
          });
        }

        console.log(
          "🎤 Voix chargée :",
          voice.name,
        );
      }

      // =======================================================
      // VALIDATION AUDIO
      // =======================================================

      if (!generation.providerVoice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Le fournisseur vocal est requis pour une génération audio.",
        });
      }

      if (!voice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Une voix est requise pour cette génération audio.",
        });
      }

      // =======================================================
      // PREPARATION
      // =======================================================

      await this.updateProgress(
        generation.id,
        15,
        "Préparation du texte",
      );

      // =======================================================
      // PIPELINE
      // =======================================================

      console.log(
        "🎙️ Lancement du pipeline",
      );

      const pipeline =
        new GenerationPipeline();

      const result =
        await pipeline.execute({
          generation,
          voice,

          // ===================================================
          // CALLBACK DE PROGRESSION
          // ===================================================

          onProgress: async (
            progress: number,
            currentStep: string,
          ) => {
            await this.updateProgress(
              generation.id,
              progress,
              currentStep,
            );
          },
        });

      console.log(
        "✅ Pipeline terminé",
      );

      // =======================================================
      // FINALISATION
      // =======================================================

      await this.updateProgress(
        generation.id,
        95,
        "Finalisation",
      );

      // =======================================================
      // SAVE
      // =======================================================

      await this.generationRepository.update(
        generation.id,
        {
          status:
            GenerationStatus.COMPLETED,

          progress: 100,

          currentStep:
            "Génération terminée",

          result:
            result.text,

          transcript:
            result.text,

          audioUrl:
            result.audioUrl ??
            null,

          duration:
            result.duration ??
            null,

          error: null,
        },
      );

      console.log(
        "🎉 Génération terminée",
      );

      console.log(
        `✅ Generation ${generation.id} completed.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erreur inconnue.";

      console.error(
        "❌ Erreur pendant le traitement :",
        message,
      );

      // =======================================================
      // FAILED
      // =======================================================

      try {
        await this.generationRepository.update(
          generation.id,
          {
            status:
              GenerationStatus.FAILED,

            progress:
              generation.progress ?? 0,

            currentStep:
              "Échec",

            error: message,
          },
        );
      } catch (updateError) {
        console.error(
          "❌ Impossible de mettre à jour le statut FAILED :",
          updateError,
        );
      }

      throw error;
    }
  }

  // =========================================================
  // UPDATE PROGRESS
  // =========================================================

  private async updateProgress(
    generationId: string,
    progress: number,
    currentStep: string,
  ): Promise<void> {
    const safeProgress =
      Math.min(
        Math.max(
          Math.round(progress),
          0,
        ),
        100,
      );

    console.log(
      `📊 Progression ${safeProgress}% — ${currentStep}`,
    );

    await this.generationRepository.updateProgress(
      generationId,
      safeProgress,
      currentStep,
    );
  }
}