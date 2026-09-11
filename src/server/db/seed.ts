import {
  PrismaClient,
  VoiceProviderType,
  VoiceType,
} from "@prisma/client";

const prisma = new PrismaClient();

const voices = [
  // =====================================================
  // PIPER
  // =====================================================

  {
    name: "Siwis",
    provider: VoiceProviderType.PIPER,
    providerVoiceId: "fr_FR-siwis-medium",
    type: VoiceType.FREE,
    language: "fr-FR",
    gender: "female",
    description:
      "Voix française Piper adaptée à la narration.",
    isActive: true,
  },

  // =====================================================
  // EDGE TTS
  // =====================================================

  {
    name: "Denise",
    provider: VoiceProviderType.EDGE_TTS,
    providerVoiceId: "fr-FR-DeniseNeural",
    type: VoiceType.FREE,
    language: "fr-FR",
    gender: "female",
    description:
      "Voix française naturelle Edge TTS.",
    isActive: true,
  },

  {
    name: "Henri",
    provider: VoiceProviderType.EDGE_TTS,
    providerVoiceId: "fr-FR-HenriNeural",
    type: VoiceType.FREE,
    language: "fr-FR",
    gender: "male",
    description:
      "Voix masculine française Edge TTS.",
    isActive: true,
  },

  {
    name: "Eloise",
    provider: VoiceProviderType.EDGE_TTS,
    providerVoiceId: "fr-FR-EloiseNeural",
    type: VoiceType.FREE,
    language: "fr-FR",
    gender: "female",
    description:
      "Voix française expressive Edge TTS.",
    isActive: true,
  },

  {
    name: "Guy",
    provider: VoiceProviderType.EDGE_TTS,
    providerVoiceId: "en-US-GuyNeural",
    type: VoiceType.FREE,
    language: "en-US",
    gender: "male",
    description:
      "Voix anglaise masculine Edge TTS.",
    isActive: true,
  },

  {
    name: "Jenny",
    provider: VoiceProviderType.EDGE_TTS,
    providerVoiceId: "en-US-JennyNeural",
    type: VoiceType.FREE,
    language: "en-US",
    gender: "female",
    description:
      "Voix anglaise féminine Edge TTS.",
    isActive: true,
  },

  // =====================================================
  // GOOGLE
  // =====================================================

  {
    name: "Google Français Femme",
    provider: VoiceProviderType.GOOGLE,
    providerVoiceId: "fr-FR-Neural2-A",
    type: VoiceType.PREMIUM,
    language: "fr-FR",
    gender: "female",
    description:
      "Voix française Google Cloud Text-to-Speech.",
    isActive: true,
  },

  {
    name: "Google Français Homme",
    provider: VoiceProviderType.GOOGLE,
    providerVoiceId: "fr-FR-Neural2-B",
    type: VoiceType.PREMIUM,
    language: "fr-FR",
    gender: "male",
    description:
      "Voix masculine française Google Cloud Text-to-Speech.",
    isActive: true,
  },

  // =====================================================
  // ELEVENLABS
  // =====================================================

  {
    name: "ElevenLabs Rachel",
    provider: VoiceProviderType.ELEVENLABS,
    providerVoiceId: "21m00Tcm4TlvDq8ikWAM",
    type: VoiceType.PREMIUM,
    language: "en-US",
    gender: "female",
    description:
      "Voix ElevenLabs pour la narration.",
    isActive: true,
  },

  {
    name: "ElevenLabs Adam",
    provider: VoiceProviderType.ELEVENLABS,
    providerVoiceId: "pNInz6obpgDQGcFmaJgB",
    type: VoiceType.PREMIUM,
    language: "en-US",
    gender: "male",
    description:
      "Voix masculine ElevenLabs.",
    isActive: true,
  },

  // =====================================================
  // OPENAI
  // =====================================================

  {
    name: "OpenAI Alloy",
    provider: VoiceProviderType.OPENAI,
    providerVoiceId: "alloy",
    type: VoiceType.PREMIUM,
    language: "en-US",
    gender: "female",
    description:
      "Voix OpenAI polyvalente.",
    isActive: true,
  },

  {
    name: "OpenAI Echo",
    provider: VoiceProviderType.OPENAI,
    providerVoiceId: "echo",
    type: VoiceType.PREMIUM,
    language: "en-US",
    gender: "male",
    description:
      "Voix masculine OpenAI.",
    isActive: true,
  },

  {
    name: "OpenAI Nova",
    provider: VoiceProviderType.OPENAI,
    providerVoiceId: "nova",
    type: VoiceType.PREMIUM,
    language: "en-US",
    gender: "female",
    description:
      "Voix OpenAI adaptée à la narration.",
    isActive: true,
  },

  // =====================================================
  // MINIMAX
  // =====================================================

  {
    name: "MiniMax Female",
    provider: VoiceProviderType.MINIMAX,
    providerVoiceId: "female-01",
    type: VoiceType.PREMIUM,
    language: "en-US",
    gender: "female",
    description:
      "Voix féminine MiniMax.",
    isActive: true,
  },

  {
    name: "MiniMax Male",
    provider: VoiceProviderType.MINIMAX,
    providerVoiceId: "male-01",
    type: VoiceType.PREMIUM,
    language: "en-US",
    gender: "male",
    description:
      "Voix masculine MiniMax.",
    isActive: true,
  },

  // =====================================================
  // MICROSOFT
  // =====================================================

  {
    name: "Microsoft Denise",
    provider: VoiceProviderType.MICROSOFT,
    providerVoiceId: "fr-FR-DeniseNeural",
    type: VoiceType.PREMIUM,
    language: "fr-FR",
    gender: "female",
    description:
      "Voix française Microsoft Azure.",
    isActive: true,
  },

  {
    name: "Microsoft Henri",
    provider: VoiceProviderType.MICROSOFT,
    providerVoiceId: "fr-FR-HenriNeural",
    type: VoiceType.PREMIUM,
    language: "fr-FR",
    gender: "male",
    description:
      "Voix masculine française Microsoft Azure.",
    isActive: true,
  },

];

async function main() {
  console.log("🌱 Début du seed des voix...\n");

  for (const voice of voices) {
    const existing = await prisma.voice.findFirst({
      where: {
        provider: voice.provider,
        providerVoiceId: voice.providerVoiceId,
      },
    });

    if (existing) {
      await prisma.voice.update({
        where: {
          id: existing.id,
        },
        data: voice,
      });

      console.log(
        `🔄 Mise à jour : ${voice.provider} / ${voice.name}`,
      );
    } else {
      await prisma.voice.create({
        data: voice,
      });

      console.log(
        `✅ Création : ${voice.provider} / ${voice.name}`,
      );
    }
  }

  console.log(
    `\n🎉 ${voices.length} voix traitées avec succès.`,
  );
}

main()
  .catch((error) => {
    console.error("\n❌ Erreur pendant le seed :");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });