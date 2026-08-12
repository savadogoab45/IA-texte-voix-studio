import OpenAI from "openai";

import { openai } from "@/lib/openai";

import type { TTSProvider } from "../interfaces/tts-provider.interface";
import type { GenerateAudioDto } from "../dtos/generate-audio.dto";
import type { AudioResult } from "../dtos/audio-result.dto";

export class OpenAITTSProvider implements TTSProvider {

    async generate(
        input: GenerateAudioDto,
    ): Promise<AudioResult> {

        const response = await openai.audio.speech.create({
            model: "gpt-4o-mini-tts",

            voice: input.voiceId,

            input: input.text,

            response_format: "mp3",
        });

        const arrayBuffer = await response.arrayBuffer();

        return {
            buffer: Buffer.from(arrayBuffer),
            duration: 0,
            mimeType: "audio/mpeg",
        };
    }
}