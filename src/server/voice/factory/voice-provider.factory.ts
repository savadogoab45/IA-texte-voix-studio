import { VoiceProviderType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import type { VoiceProvider } from "../interfaces/voice-provider";
import { GoogleVoiceProvider } from "../providers/google.provider";
import { ElevenLabsVoiceProvider } from "../providers/elevenlabs.provider";
import { MicrosoftVoiceProvider } from "../providers/microsoft.provider";
import { MiniMaxVoiceProvider } from "../providers/minimax.provider";
import { OpenAIVoiceProvider } from "../providers/openai.provider";

export class VoiceProviderFactory {
  private static readonly providers = {
    [VoiceProviderType.OPENAI]: new OpenAIVoiceProvider(),
    [VoiceProviderType.ELEVENLABS]: new ElevenLabsVoiceProvider(),
    [VoiceProviderType.GOOGLE]: new GoogleVoiceProvider(),
    [VoiceProviderType.MICROSOFT]: new MicrosoftVoiceProvider(),
    [VoiceProviderType.MINIMAX]: new MiniMaxVoiceProvider(),
  };

  static create(provider: VoiceProviderType): VoiceProvider {
    const voiceProvider = this.providers[provider];

    if (!voiceProvider) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Voice provider non supporté.",
      });
    }

    return voiceProvider;
  }
}
