import type { AudioResult } from "../dtos/audio-result.dto";
import type { GenerateAudioDto } from "../dtos/generate-audio.dto";

export interface TTSProvider {
    generate(
        input: GenerateAudioDto,
    ): Promise<AudioResult>;
}   