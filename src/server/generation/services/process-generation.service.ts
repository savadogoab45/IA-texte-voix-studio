import { TRPCError } from "@trpc/server";
import { GenerationStatus } from "@prisma/client";

import { GenerationPipeline } from "../pipeline/generation.pipeline";
import type { VoiceRepository } from "@/server/voice/repositories/voice.repository";
import type { GenerationRepository } from "../repositories/generation.repository";

export class ProcessGenerationService {
    constructor(
        private readonly generationRepository: GenerationRepository,
        private readonly voiceRepository: VoiceRepository,
    ) { }

    async execute(generationId: string) {
        console.log("⚙️ Début du traitement :", generationId);

        const generation =
            await this.generationRepository.findById(generationId);

        if (!generation) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Génération introuvable.",
            });
        }

        console.log("✅ Génération chargée");

        try {
            await this.generationRepository.update(generation.id, {
                status: GenerationStatus.RUNNING,
                progress: 5,
                currentStep: "Initialisation",
                error: null,
            });

            console.log("🟡 Statut RUNNING");

            if (!generation.voiceId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Aucune voix sélectionnée.",
                });
            }

            const voice =
                await this.voiceRepository.findById(generation.voiceId);

            if (!voice) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Voix introuvable.",
                });
            }

            console.log("🎤 Voix chargée");

            await this.generationRepository.updateProgress(
                generation.id,
                20,
                "Préparation du texte",
            );

            console.log("🎙️ Lancement du pipeline");

            const pipeline = new GenerationPipeline();

            const result = await pipeline.execute({
                generation,
                voice,
            });

            await this.generationRepository.updateProgress(
                generation.id,
                80,
                "Sauvegarde",
            );

            await this.generationRepository.update(generation.id, {
                status: GenerationStatus.COMPLETED,
                progress: 100,
                currentStep: "Terminé",
                result: result.text,
                transcript: result.text,
                audioUrl: result.audioUrl,
                duration: result.duration,
                error: null,
            });

            console.log("🎉 Génération terminée");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erreur inconnue";

            console.error("❌ Erreur pendant le traitement :", message);

            await this.generationRepository.update(generation.id, {
                status: GenerationStatus.FAILED,
                progress: 100,
                currentStep: "Échec",
                error: message,
            });

            throw error;
        }
    }
}