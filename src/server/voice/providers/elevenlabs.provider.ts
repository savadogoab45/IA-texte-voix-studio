import type { GenerateAudioDto } from "../dtos/generate-audio.dto";
import type { GenerateAudioResultDto } from "../dtos/generate-audio-result.dto";
import type { VoiceProvider } from "../interfaces/voice-provider";

export class ElevenLabsVoiceProvider implements VoiceProvider {
  async generate(input: GenerateAudioDto): Promise<GenerateAudioResultDto> {
    console.log(input);

    return {
      buffer: Buffer.alloc(0),
      mimeType: "audio/mpeg",
      extension: "mp3",
    };
  }
}
