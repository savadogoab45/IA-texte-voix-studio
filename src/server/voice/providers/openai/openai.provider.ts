import OpenAI from "openai";

import { openai } from "@/server/openai/client";

import type { GenerateAudioDto } from "../../dtos/generate-audio.dto";
import type { GenerateAudioResultDto } from "../../dtos/generate-audio-result.dto";
import type { VoiceProvider } from "../../interfaces/voice-provider";
import { getMp3Duration } from "@/server/audio/mp3-duration";

export class OpenAIVoiceProvider implements VoiceProvider {
  async generate(
    input: GenerateAudioDto,
  ): Promise<GenerateAudioResultDto> {
    try {
      const response = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: input.voiceId,
        input: input.text,
        response_format: "mp3",
      });

      const buffer = Buffer.from(await response.arrayBuffer());

      return {
        buffer,
        mimeType: "audio/mpeg",
        extension: "mp3",
        duration: getMp3Duration(buffer),
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        switch (error.status) {
          case 401:
            throw new Error("Clé API OpenAI invalide pour la voix preview.");

          case 429:
            throw new Error(
              "Quota OpenAI dépassé ou facturation inactive pour la voix preview.",
            );

          default:
            throw new Error(
              `OpenAI Voice (${error.status}) : ${error.message}`,
            );
        }
      }

      throw error;
    }
  }
}