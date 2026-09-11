import {
  StorageProviderType,
  type AIProviderType,
  type Generation,
  type Voice,
} from "@prisma/client";
import { parseBuffer } from "music-metadata";

import { AIProviderFactory } from "@/server/ai/factory/ai-provider.factory";
import { StorageProviderFactory } from "@/server/storage/factory/storage-provider.factory";
import type { UploadResultDto } from "@/server/storage/dtos/upload-result.dto";
import { VoiceProviderFactory } from "@/server/voice/factory/voice-provider.factory";
import type { GenerateAudioResultDto } from "@/server/voice/dtos/generate-audio-result.dto";

import type { PipelineResultDto } from "../dtos/pipeline-result.dto";

interface PipelineInput {
  generation: Generation;
  voice: Voice | null;
  onProgress?: (
    progress: number,
    currentStep: string,
  ) => Promise<void> | void;
}

export class GenerationPipeline {
  async execute({
    generation,
    voice,
    onProgress,
  }: PipelineInput): Promise<PipelineResultDto> {
    // =========================================================
    // VOICE
    // =========================================================

    if (!voice) {
      throw new Error(
        "Une voix est requise pour générer l'audio.",
      );
    }

    // =========================================================
    // PREPARATION DU TEXTE
    // =========================================================

    console.log("📝 Préparation du texte...");
    await onProgress?.(20, "Préparation du texte");

    const preparedText =
      await this.prepareText(generation);

    console.log("✅ Texte prêt");
    await onProgress?.(35, "Texte préparé");

    // =========================================================
    // GENERATION AUDIO
    // =========================================================

    console.log(
      "🎤 Génération audio avec :",
      generation.providerVoice ??
        voice.provider,
    );

    await onProgress?.(45, "Génération audio");

    const audio =
      await this.generateAudio(
        preparedText,
        voice,
        onProgress,
      );

    // =========================================================
    // VALIDATION AUDIO
    // =========================================================

    await onProgress?.(65, "Validation du rendu audio");
    this.validateAudio(audio);

    console.log(
      "✅ Audio généré :",
      {
        size: audio.buffer.length,
        mimeType: audio.mimeType,
        extension: audio.extension,
        duration: audio.duration ?? null,
      },
    );

    // =========================================================
    // UPLOAD
    // =========================================================

    console.log("☁️ Upload...");
    await onProgress?.(80, "Upload du fichier audio");

    const uploaded =
      await this.uploadAudio(audio);

    console.log(
      "✅ Upload terminé :",
      {
        url: uploaded.url,
        size: uploaded.size,
      },
    );
    await onProgress?.(90, "Finalisation");

    // =========================================================
    // RESULT
    // =========================================================

    return {
      text: preparedText,
      audioUrl: uploaded.url,
      duration:
        audio.duration ?? null,
    };
  }

  // =========================================================
  // PREPARE TEXT
  // =========================================================

  private async prepareText(
    generation: Generation,
  ): Promise<string> {
    if (!generation.prompt?.trim()) {
      throw new Error(
        "Le prompt est vide.",
      );
    }

    // =======================================================
    // AUCUN PROVIDER IA
    // =======================================================

    const providerAi =
      generation.providerAi;

    if (
      providerAi === null ||
      providerAi === undefined
    ) {
      console.log(
        "📄 Aucun provider IA.",
      );

      console.log(
        "➡️ Utilisation directe du texte.",
      );

      return generation.prompt.trim();
    }

    // =======================================================
    // PROVIDER IA
    // =======================================================

    const aiProvider: AIProviderType =
      providerAi;

    console.log(
      "🤖 Provider IA :",
      aiProvider,
    );

    const provider =
      AIProviderFactory.create(
        aiProvider,
      );

    const result =
      await provider.generate({
        prompt:
          generation.prompt,
      });

    if (!result?.trim()) {
      throw new Error(
        "Le provider IA a retourné un texte vide.",
      );
    }

    return result.trim();
  }

  // =========================================================
  // GENERATE AUDIO
  // =========================================================

  private async generateAudio(
    text: string,
    voice: Voice,
    onProgress?: (
      progress: number,
      currentStep: string,
    ) => Promise<void> | void,
  ): Promise<GenerateAudioResultDto> {
    if (!text?.trim()) {
      throw new Error(
        "Impossible de générer l'audio : le texte est vide.",
      );
    }

    if (!voice.provider) {
      throw new Error(
        "Le provider vocal de la voix est manquant.",
      );
    }

    if (!voice.providerVoiceId?.trim()) {
      throw new Error(
        "L'identifiant de la voix du provider est manquant.",
      );
    }

    const provider =
      VoiceProviderFactory.create(
        voice.provider,
      );

    console.log(
      "🔊 Voice provider :",
      voice.provider,
    );

    console.log(
      "🗣️ Voice :",
      voice.name,
    );

    console.log(
      "🆔 Provider voice ID :",
      voice.providerVoiceId,
    );

    // =========================================================
    // PROGRESS SIMULATION
    // =========================================================

    let currentProgress = 45;
    const progressInterval = setInterval(async () => {
      if (currentProgress < 60) {
        currentProgress += Math.random() * 3;
        await onProgress?.(
          Math.min(currentProgress, 60),
          "Génération audio...",
        );
      }
    }, 500);

    try {
      const audio =
        await provider.generate({
          text: text.trim(),

          voiceId:
            voice.providerVoiceId,
        });

      clearInterval(progressInterval);

      // =======================================================
      // CALCUL DE LA DURÉE AUDIO
      // =======================================================

      // On utilise les métadonnées du fichier comme source de vérité.
      // Cela évite de dépendre d'une éventuelle durée fournie
      // par le provider TTS.
      console.log("🎵 Analyse du fichier audio...");
      console.log(
        "📦 Taille du buffer :",
        audio.buffer.length,
        "bytes",
      );
      console.log("🎧 Type MIME :", audio.mimeType);

      const metadata = await parseBuffer(
        audio.buffer,
        { mimeType: audio.mimeType },
      );

      const rawDuration = metadata.format.duration ?? 0;

      console.log(
        "⏱️ Durée brute détectée :",
        rawDuration,
        "secondes",
      );

      // Generation.duration est un Int Prisma.
      // On stocke donc la durée en secondes entières.
      const duration = Math.round(rawDuration);

      console.log(
        "⏱️ Durée à enregistrer :",
        duration,
        "secondes",
      );

      if (duration <= 0) {
        throw new Error(
          "Impossible de déterminer la durée du fichier audio généré.",
        );
      }

      return {
        ...audio,
        duration,
      };
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  }

  // =========================================================
  // VALIDATE AUDIO
  // =========================================================

  private validateAudio(
    audio: GenerateAudioResultDto,
  ): void {
    if (!audio) {
      throw new Error(
        "Le provider vocal n'a retourné aucun résultat.",
      );
    }

    if (!audio.buffer) {
      throw new Error(
        "Le provider vocal n'a retourné aucun buffer audio.",
      );
    }

    if (
      !Buffer.isBuffer(
        audio.buffer,
      )
    ) {
      throw new Error(
        "Le résultat du provider vocal contient un buffer audio invalide.",
      );
    }

    if (
      audio.buffer.length === 0
    ) {
      throw new Error(
        "Le provider vocal a retourné un buffer audio vide.",
      );
    }

    if (
      !audio.extension?.trim()
    ) {
      throw new Error(
        "Le provider vocal n'a retourné aucune extension audio.",
      );
    }

    if (
      !audio.mimeType?.trim()
    ) {
      throw new Error(
        "Le provider vocal n'a retourné aucun type MIME.",
      );
    }

    console.log(
      "🔎 Validation audio réussie :",
      {
        bytes:
          audio.buffer.length,

        mimeType:
          audio.mimeType,

        extension:
          audio.extension,

        duration:
          audio.duration ?? null,
      },
    );
  }

  // =========================================================
  // UPLOAD AUDIO
  // =========================================================

  private async uploadAudio(
    audio: GenerateAudioResultDto,
  ): Promise<UploadResultDto> {
    // =======================================================
    // DOUBLE VALIDATION AVANT STORAGE
    // =======================================================

    if (!audio.buffer) {
      throw new Error(
        "Impossible d'uploader l'audio : buffer absent.",
      );
    }

    if (
      !Buffer.isBuffer(
        audio.buffer,
      )
    ) {
      throw new Error(
        "Impossible d'uploader l'audio : buffer invalide.",
      );
    }

    if (
      audio.buffer.length === 0
    ) {
      throw new Error(
        "Impossible d'uploader l'audio : buffer vide.",
      );
    }

    if (
      !audio.extension?.trim()
    ) {
      throw new Error(
        "Impossible d'uploader l'audio : extension manquante.",
      );
    }

    if (
      !audio.mimeType?.trim()
    ) {
      throw new Error(
        "Impossible d'uploader l'audio : MIME type manquant.",
      );
    }

    const filename =
      `${crypto.randomUUID()}.${audio.extension}`;

    console.log(
      "☁️ Préparation upload :",
      {
        filename,

        size:
          audio.buffer.length,

        mimeType:
          audio.mimeType,

        extension:
          audio.extension,
      },
    );

    // =======================================================
    // STORAGE
    // =======================================================

    const storage =
      StorageProviderFactory.create(
        StorageProviderType.LOCAL,
      );

    const uploaded =
      await storage.upload({
        filename,

        mimeType:
          audio.mimeType,

        buffer:
          audio.buffer,
      });

    // =======================================================
    // VALIDATION UPLOAD
    // =======================================================

    if (!uploaded) {
      throw new Error(
        "Le Storage n'a retourné aucun résultat.",
      );
    }

    if (!uploaded.url) {
      throw new Error(
        "Le Storage n'a retourné aucune URL.",
      );
    }

    if (
      typeof uploaded.size === "number" &&
      uploaded.size <= 0
    ) {
      throw new Error(
        "Le Storage a enregistré un fichier audio vide.",
      );
    }

    console.log(
      "💾 Storage validé :",
      {
        url:
          uploaded.url,

        size:
          uploaded.size,
      },
    );

    return uploaded;
  }
}