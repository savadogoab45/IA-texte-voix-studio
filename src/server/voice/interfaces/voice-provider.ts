import type { GenerateAudioDto } from "../dtos/generate-audio.dto";
import type { GenerateAudioResultDto } from "../dtos/generate-audio-result.dto";

export interface VoiceProvider {
  generate(input: GenerateAudioDto): Promise<GenerateAudioResultDto>;
}
