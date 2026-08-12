import { openai } from "@/server/openai/client";

import type { GenerateAudioDto } from "../dtos/generate-audio.dto";
import type { GenerateAudioResultDto } from "../dtos/generate-audio-result.dto";
import type { VoiceProvider } from "../interfaces/voice-provider";

export class OpenAIVoiceProvider implements VoiceProvider {
  async generate(
    input: GenerateAudioDto,
  ): Promise<GenerateAudioResultDto> {

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
      duration: 0,
    };
  }
}