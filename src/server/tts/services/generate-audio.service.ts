import type { Voice } from "@prisma/client";
import { TTSFactory } from "../factory/tts.factory";

export class GenerateAudioService {

    async execute(
        text: string,
        voice: Voice,
    ) {

        const provider =
            TTSFactory.make(
                voice.provider,
            );

        return provider.generate({
            text,
            voiceId: voice.providerVoiceId,
        });

    }

}