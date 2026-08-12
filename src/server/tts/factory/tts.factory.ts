import { VoiceProviderType } from "@prisma/client";
import { OpenAITTSProvider } from "../providers/openai-tts.provider";

export class TTSFactory {

    static make(
        provider: VoiceProviderType,
    ) {

        switch (provider) {

            case VoiceProviderType.OPENAI:
                return new OpenAITTSProvider();
/*
            case VoiceProviderType.ELEVENLABS:
                return new ElevenLabsProvider();

            case VoiceProviderType.GOOGLE:
                return new GoogleProvider();

            case VoiceProviderType.MINIMAX:
                return new MiniMaxProvider();
*/
            default:
                throw new Error(
                    "Provider TTS non supporté.",
                );
        }
    }

}