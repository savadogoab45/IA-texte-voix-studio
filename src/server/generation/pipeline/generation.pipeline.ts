import {
  StorageProviderType,
  type Generation,
  type Voice,
} from "@prisma/client";

import { AIProviderFactory } from "@/server/ai/factory/ai-provider.factory";
import { StorageProviderFactory } from "@/server/storage/factory/storage-provider.factory";
import type { UploadResultDto } from "@/server/storage/dtos/upload-result.dto";
import { VoiceProviderFactory } from "@/server/voice/factory/voice-provider.factory";
import type { GenerateAudioResultDto } from "@/server/voice/dtos/generate-audio-result.dto";

import type { PipelineResultDto } from "../dtos/pipeline-result.dto";

interface PipelineInput {
  generation: Generation;
  voice: Voice;
}

export class GenerationPipeline {

  async execute({
    generation,
    voice,
  }: PipelineInput): Promise<PipelineResultDto> {

    console.log("📝 Préparation du texte...");

    const preparedText =
      await this.prepareText(generation);

    console.log("✅ Texte généré");

    console.log("🎤 Génération audio...");

    const audio =
      await this.generateAudio(
        preparedText,
        voice,
      );

    console.log("✅ Audio généré");

    console.log("☁️ Upload...");

    const uploaded =
      await this.uploadAudio(audio);

    console.log("✅ Upload terminé");
      
    return {
      text: preparedText,
      audioUrl: uploaded.url,
    };
  }

  private async prepareText(
    generation: Generation,
  ): Promise<string> {

    if (!generation.prompt) {
      throw new Error("Le prompt est vide.");
    }

    const provider =
      AIProviderFactory.create(
        generation.provider,
      );

    return provider.generate({
      prompt: generation.prompt,
    });
  }

  private async generateAudio(
    text: string,
    voice: Voice,
  ): Promise<GenerateAudioResultDto> {

    const provider =
      VoiceProviderFactory.create(
        voice.provider,
      );

    return provider.generate({
      text,
      voiceId: voice.providerVoiceId,
    });
  }

  private async uploadAudio(
    audio: GenerateAudioResultDto,
  ): Promise<UploadResultDto> {

    const storage =
      StorageProviderFactory.create(
        StorageProviderType.LOCAL,
      );

    return storage.upload({
      filename:
        `${crypto.randomUUID()}.${audio.extension}`,
      mimeType: audio.mimeType,
      buffer: audio.buffer,
    });
  }

}