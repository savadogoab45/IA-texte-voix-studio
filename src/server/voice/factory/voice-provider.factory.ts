import { VoiceProviderType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import type { VoiceProvider } from "../interfaces/voice-provider";

import { GoogleVoiceProvider } from "../providers/google/google.provider";
import { ElevenLabsVoiceProvider } from "../providers/elevenlabs/elevenlabs.provider";
import { MicrosoftVoiceProvider } from "../providers/microsoft.provider";
import { MiniMaxVoiceProvider } from "../providers/minimax.provider";
import { OpenAIVoiceProvider } from "../providers/openai/openai.provider";
import { PiperVoiceProvider } from "../providers/piper/piper.provider";
import { EdgeTTSVoiceProvider } from "../providers/edge-tts/edge-tts.provider";

export class VoiceProviderFactory {
  private static readonly providers: Record<
    VoiceProviderType,
    VoiceProvider
  > = {
    // =========================================================
    // OPENAI
    // =========================================================

    [VoiceProviderType.OPENAI]:
      new OpenAIVoiceProvider(),

    // =========================================================
    // ELEVENLABS
    // =========================================================

    [VoiceProviderType.ELEVENLABS]:
      new ElevenLabsVoiceProvider(),

    // =========================================================
    // GOOGLE
    // =========================================================

    [VoiceProviderType.GOOGLE]:
      new GoogleVoiceProvider(),

    // =========================================================
    // MICROSOFT
    // =========================================================

    [VoiceProviderType.MICROSOFT]:
      new MicrosoftVoiceProvider(),

    // =========================================================
    // MINIMAX
    // =========================================================

    [VoiceProviderType.MINIMAX]:
      new MiniMaxVoiceProvider(),

    // =========================================================
    // PIPER
    // =========================================================

    [VoiceProviderType.PIPER]:
      new PiperVoiceProvider(),

    // =========================================================
    // EDGE TTS
    // =========================================================

    [VoiceProviderType.EDGE_TTS]:
      new EdgeTTSVoiceProvider(),
  };

  static create(
    provider: VoiceProviderType,
  ): VoiceProvider {
    const voiceProvider =
      this.providers[provider];

    if (!voiceProvider) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          `Voice provider non supporté : ${provider}`,
      });
    }

    return voiceProvider;
  }
}